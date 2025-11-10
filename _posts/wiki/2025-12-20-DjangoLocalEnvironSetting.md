---
layout		: single
title		: Django 로컬에서 운영과 동일한 환경 구축하기
summary	        : 
date		: 2025-12-20 17:12:47 +0900
updated	        : 2025-12-20 18:39:11 +0900
category	: 
tags		: 
toc		: true
public		: true
parent		: 
latex		: false
resource	: CD3FB34D-1EF1-44AF-BDA0-FC5F4EAA43CF
author_profile  :  false
classes	        :  wide
---

로컬에서도 개발이나 운영과 구조적으로 동일한 환경을 구축하는 것은 중요하다.  
문제가 발생했을 때의 비용 줄어들 것이며, 문제가 발생하지 않도록 예방도 가능하다.

Django의 아키텍처르 이모저모 뜯어보면서, 어떤 환경이 필요한 지 이해하고, 로컬에서도 동일한 구조를 마련해보려고 한다.  

## runserver를 했을 때 일어나는 일

Django를 단순히 [`runserver`](https://github.com/django/django/blob/main/django/core/management/commands/runserver.py#L112)로 띄우면, 어떻게 서버가 띄워지는 걸까.
```shell
`./manage.py runserver`

> Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
December 19, 2025 - 16:46:42
Django version 6.0, using settings 'myproject.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.

WARNING: This is a development server. Do not use it in a production setting. Use a production WSGI or ASGI server instead.
For more information on production servers see: https://docs.djangoproject.com/en/6.0/howto/deployment/
```

오픈소스에서 동작을 파악해보면,
Python의 기본 라이브러리인 wsgiref의 [simple_server](https://docs.python.org/3/library/wsgiref.html#module-wsgiref.simple_server)를 사용한다.  
하나의 process가 띄어지고, [ThreadingMixIn](https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/servers/basehttp.py#L251C1-L262C86)으로 요청마다 스레드 생성한다. (thread pool에서 관리하는 듯)  
즉, WSGI를 따르는 구현체를 사용해 server를 띄운다.  
이제 WSGI를 이해할 필요가 있다.

## [WSGI](https://peps.python.org/pep-3333/)
> This document specifies a proposed standard interface between web servers and Python web applications or frameworks, to promote web application portability across a variety of web servers.
> By contrast, although Java has just as many web application frameworks available, Java’s “servlet” API makes it possible for applications written with any Java web application framework to run in any web server that supports the servlet API.

Java는 Web Application들이 servlet API를 지원하는 Web Server를 사용할 수 있는 모양이다.  
WSGI는 이와 유사하게, Web Server/Gateway와 Application/Framework가 통신할 수 있도록 표준을 정의한 것이다.

### [**The Application/Framework Side**](https://peps.python.org/pep-3333/#the-application-framework-side)
The application object is simply a callable object that accepts two arguments.

Django의 기본 wsgi 구현을 보면, WSGI에 맞게 callable한 object를 구현했고, environ, start_response를 인자로 받고 있다.
"""
WSGI config for myproject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/wsgi.py
```
def get_wsgi_application():
    """
    The public interface to Django's WSGI support. Return a WSGI callable.

    Avoids making django.core.handlers.WSGIHandler a public API, in case the
    internal WSGI implementation changes or moves in the future.
    """
    django.setup(set_prefix=False)
    return WSGIHandler()
```

https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/handlers/wsgi.py#L113
```
class WSGIHandler(base.BaseHandler):
    request_class = WSGIRequest

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.load_middleware()

    def __call__(self, environ, start_response):
        set_script_prefix(get_script_name(environ))
        signals.request_started.send(sender=self.__class__, environ=environ)
        request = self.request_class(environ)
        response = self.get_response(request)

        response._handler_class = self.__class__

        status = "%d %s" % (response.status_code, response.reason_phrase)
        response_headers = [
            *response.items(),
            *(("Set-Cookie", c.OutputString()) for c in response.cookies.values()),
        ]
        start_response(status, response_headers)
        if getattr(response, "file_to_stream", None) is not None and environ.get(
            "wsgi.file_wrapper"
        ):
            # If `wsgi.file_wrapper` is used the WSGI server does not call
            # .close on the response, but on the file wrapper. Patch it to use
            # response.close instead which takes care of closing all files.
            response.file_to_stream.close = response.close
            response = environ["wsgi.file_wrapper"](
                response.file_to_stream, response.block_size
            )
        return response
```



[**The Server/Gateway Side**](https://peps.python.org/pep-3333/#the-server-gateway-side)

WSGI Server 중에서도 많이 사용하는 gunicorn을 보면,
gunicorn에서는 
https://github.com/benoitc/gunicorn/blob/master/gunicorn/app/wsgiapp.py#L46
```
    def load_wsgiapp(self):
        return util.import_app(self.app_uri)
```

```
def import_app(module):
    parts = module.split(":", 1)
    if len(parts) == 1:
        obj = "application"
    else:
        module, obj = parts[0], parts[1]

    try:
        mod = importlib.import_module(module)
```
에서 받은 경로의 모듈을 import하고

https://github.com/benoitc/gunicorn/blob/56b5ad87f8d72a674145c273ed8f547513c2b409/gunicorn/workers/sync.py#L177C1-L177C63
```
    def handle_request(self, listener, req, client, addr):
        environ = {}
        resp = None
        try:
            self.cfg.pre_request(self, req)
            request_start = datetime.now()
            resp, environ = wsgi.create(req, client, addr,
                                        listener.getsockname(), self.cfg)
            # Force the connection closed until someone shows
            # a buffering proxy that supports Keep-Alive to
            # the backend.
            resp.force_close()
            self.nr += 1
            if self.nr >= self.max_requests:
                self.log.info("Autorestarting worker after current request.")
                self.alive = False
            respiter = self.wsgi(environ, resp.start_response)
````
에서 WSGI 인터페이스에 맞게 import한 모듈을 실행하며 request를 handling한다.


gunicorn으로 django의 wsgi를 실행하면, worker만큼 process가 띄어지고, gunicorn은 request를 worker에 적절히 분배한다.
`gunicorn myproject.wsgi --workers=4`
![스크린샷 2025-12-20 02.20.34.png](attachment:774e2502-b823-45b2-91a0-98bb25eaa9d8:스크린샷_2025-12-20_02.20.34.png)

## wsgi(gunicorn)을 바로 노출하면 안되는 이유(“Gunicorn should not face the internet directly”)

gunicorn 문서를 찬찬히 살펴보면, 기본값인 sync worker만을 사용하는 경우, nginx와 같은 proxy 뒤에서 사용하는 것을 권장한다.

|If you exposed synchronous workers to the internet, a DOS attack would be trivial by creating a load that trickles data to the servers. https://docs.gunicorn.org/en/latest/design.html

|The default Sync workers are designed to run behind Nginx which only uses HTTP/1.0 with its upstream servers. If you want to deploy Gunicorn to handle unbuffered requests (ie, serving requests directly from the internet) you should use one of the async workers.  https://docs.gunicorn.org/en/21.2.0/faq.html#why-is-there-no-http-keep-alive

async worker를 사용한다면 nginx같은 reverse proxy가 필요가 없나 ? 


## nginx가 하는 일
nginx는 기본적으로 HTTP web server, reverse proxy 와 같은 것들을 책임진다.  
nginx는 TLS 핸들링이나, ip spoofing같은 보안 이슈들 혹은 기타 이유로 web applicatin server로 요청이 가지 않도록 하는 처리를 한다.
TLS 핸들링,
X-Forwarded-* headers, by default, the proxy will ignore their values from incoming requests, to prevent spoofing. 와 같은 보안 이슈 핸들링
이 검증을 대신 책임지는 게 nginx 같은 L7 프록시입니다.

Gunicorn의 `forwarded_allow_ips / proxy_allow_ips`
Django의 SECURE_PROXY_SSL_HEADER를 통해 nginx에 HTTPS로 들어온 요청임을 책임지고, gunicorn, django는 이를 신뢰.
따라서 public한 network에는 reverse proxy만 노출해 모든 요청이 proxy를 거치도록 구성한다.


### **책임 분리**

gunicorn myproj.wsgi:application \
--certfile cert.pem \
--keyfile key.pem

이걸 하면 TLS를 gunicorn이 수행하는거 아닌가 ?
맞는 말이지만, gunicorn worker를 TLS에 할당했을 때의 성능 문제 혹은 여러 보안 사항이나 request 처리를 gunicorn에 다시 구현하기 보단 nginx를 사용하는 것이 안정적.
그래서 일반적으로 nginx를 web server로 gunicorn은 Django라는 Framework를 감싸고 worker 로 request를 분배하는 역할

로컬에서도 구조적으로 동일하도록 구성하려면 reverse proxy가  필요

## Caddy for local reverse proxy

우리가 필요한 건, TLS와 reverse proxy를 책임져줄 녀석.

caddy는 ACME로 TLS 설정을 해주지 않아도, 인증서를 자동 관리하며 TLS를 핸들링한다. 그레서 reverse proxy만 처리해주면 된다.

```bash
{
    debug
}

localhost:8080 {
    reverse_proxy localhost:8000 {
      header_up X-Forwarded-Proto https
    }
}
```

![스크린샷 2025-12-20 오후 4.59.01.png](attachment:bbdf8b19-9553-42b5-9543-df20ba707ebe:스크린샷_2025-12-20_오후_4.59.01.png)

gunicorn Django에는 https를 사용하지 않고, caddy가 보내주는 요청을 신뢰한다.
settings.py
```bash
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO','https')
ALLOWED_HOSTS = ["localhost","127.0.0.1"]
CSRF_TRUSTED_ORIGINS = [
  "https://localhost:8000",
]
```
