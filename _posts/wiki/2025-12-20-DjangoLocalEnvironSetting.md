---
layout		: single
title		: Django - 로컬에서 운영과 동일한 환경 구축하기
summary	    : 
date		: 2025-12-20 17:12:47 +0900
updated	    : 2025-12-20 18:39:11 +0900
category	: 
tags		: 
toc		    : true
public		: true
parent		: 
latex		: false
resource	: CD3FB34D-1EF1-44AF-BDA0-FC5F4EAA43CF
author_profile  :  false
classes	        :  wide
---
<img src="/assets/images/DjangoLocalEnvironSetting/django_infra.png" />  
Django의 infra 구성을 이모저모 뜯어보면서 어떤 환경이 필요한 지 이해하고, 로컬에서도 개발 혹은 운영과 구조적인 동일함을 마련해보려고 한다.  

## runserver를 했을 때 일어나는 일
Django를 단순히 [`runserver`](https://github.com/django/django/blob/main/django/core/management/commands/runserver.py#L112 Django Runserver Command)로 띄우면, 어떻게 서버가 띄워지는 걸까.  
[오픈소스](https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/servers/basehttp.py#L251C1-L262C86 Django basehttp.py)에서 동작을 파악해보면,  
Python의 기본 라이브러리인 wsgiref의 [`simple_server`](https://docs.python.org/3/library/wsgiref.html#module-wsgiref.simple_server wsgiref)를 사용한다.  

{% capture django_runserver %}
# https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/servers/basehttp.py#L251C1-L262C86
def run(
    addr,
    port,
    wsgi_handler,
    ipv6=False,
    threading=False,
    on_bind=None,
    server_cls=WSGIServer,
):
    server_address = (addr, port)
    if threading:
        httpd_cls = type("WSGIServer", (socketserver.ThreadingMixIn, server_cls), {})a
{% endcapture %}

{% include code-table.html
    tabs="django_runserver"
    django_runserver=django_runserver
    django_runserver_language="python"
%}

즉, WSGI를 따르는 구현체를 사용해 server를 띄운다는 것을 알 수 있다.  
이제 WSGI를 이해할 필요가 있다.

## WSGI
> This document specifies a proposed **standard interface between web servers and Python web applications or frameworks**, to promote web application portability across a variety of web servers.
> By contrast, although Java has just as many web application frameworks available, Java’s “servlet” API makes it possible for applications written with any Java web application framework to run in any web server that supports the servlet API.  
 
Java는 Web Application들이 servlet API를 지원하는 Web Server를 사용할 수 있는 모양이다.  
[WSGI](https://peps.python.org/pep-3333/ Web Server Gateway Interface)는 이와 유사하게, **Web Server/Gateway(가령, gunicorn)와 Application/Framework(가령, Django)가 통신할 수 있도록 인터페이스 표준**을 정의한 것이다.  

### [**The Application/Framework Side**](https://peps.python.org/pep-3333/#the-application-framework-side Web Server Gateway Interface - The Application/Framework Side)
> The application object is simply a callable object that accepts two arguments.

표준에서는 application을 단순히 **callable한 object로 정의하고 있고, environ, start_response를 인자로 받아야함**을 서술한다.  
단순히 function이든, claass이든 이 interface만 만족하면 된다.  
만약 static한 응답만 내리면 된다라고 하면, Django같은 framework를 사용하지않고 WSGI를 따르는 callable object만 정의하고 gunicorn으로 띄울 수도 있는 것.  

Django의 기본 wsgi 구현을 보면, 역시 WSGI에 맞게 callable한 object를 구현했고, environ, start_response를 인자로 받고 있다.

{% capture wsgi_content %}
WSGI config for myproject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
{% endcapture %}

{% capture django_core_wsgi_content %}
# https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/wsgi.py
def get_wsgi_application():
    """
    The public interface to Django's WSGI support. Return a WSGI callable.

    Avoids making django.core.handlers.WSGIHandler a public API, in case the
    internal WSGI implementation changes or moves in the future.
    """
    django.setup(set_prefix=False)
    return WSGIHandler()
{% endcapture %}

{% capture django_core_handlers_wsgi_content %}
# https://github.com/django/django/blob/60fecd1d445224fa00385f5f1fde75999da7bec8/django/core/handlers/wsgi.py#L113
class WSGIHandler(base.BaseHandler):
    request_class = WSGIRequest

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.load_middleware()

    def __call__(self, environ, start_response):
        # 중략 

        start_response(status, response_headers)a

        # 중략 
{% endcapture %}

{% include code-table.html
    tabs="wsgi,django_core_wsgi,django_core_handlers_wsgi"
    wsgi=wsgi_content
    wsgi_language="python"
    django_core_wsgi=django_core_wsgi_content
    django_core_wsgi_language="python"
    django_core_handlers_wsgi=django_core_handlers_wsgi_content
    django_core_handlers_wsgi_language="python"
%}


### [**The Server/Gateway Side**](https://peps.python.org/pep-3333/#the-server-gateway-side Web Server Gateway Interface - The Server/Gateway Side)

WSGI Server 중에서도 opensource인 gunicorn에서 구현을 파악할 수 있다.  
gunicorn으로 django를 `gunicorn myproject.wsgi`와 같이 실행하는데,  
뒤 인자인 `myproject.wsgi`은 application 위치로 해당 위치의 module을 import한다.  
gunicorn의 기본값인 sync worker에서는 application을 인스턴스 변수인 wsgi에 할당한 후, **WSGI에 맞게 `self.wsgi(environ, resp.start_response)`로 call해 application을 실행**한다.  

{% capture gunicorn_wsgi_app %}
# https://github.com/benoitc/gunicorn/blob/master/gunicorn/app/wsgiapp.py#L46
    def load_wsgiapp(self):
        return util.import_app(self.app_uri)
        
# https://github.com/benoitc/gunicorn/blob/master/gunicorn/util.py#L358
def import_app(module):
    parts = module.split(":", 1)
    if len(parts) == 1:
        obj = "application"
    else:
        module, obj = parts[0], parts[1]

    try:
        mod = importlib.import_module(module)
{% endcapture %}

{% capture gunicorn_sync_worker %}
# https://github.com/benoitc/gunicorn/blob/56b5ad87f8d72a674145c273ed8f547513c2b409/gunicorn/workers/sync.py#L177C1-L177C63
    def handle_request(self, listener, req, client, addr):
        environ = {}
        resp = None
        try:
            self.cfg.pre_request(self, req)
            request_start = datetime.now()
            resp, environ = wsgi.create(req, client, addr,
                                        listener.getsockname(), self.cfg)A

            # 중략

            **respiter = self.wsgi(environ, resp.start_response)**
{% endcapture %}

{% include code-table.html
    tabs="gunicorn_wsgi_app,gunicorn_sync_worker"
    gunicorn_wsgi_app=gunicorn_wsgi_app
    gunicorn_wsgi_app_language="python"
    gunicorn_sync_worker=gunicorn_sync_worker
    gunicorn_sync_worker_language="python"
%}


## WSGI(gunicorn)을 public network에 노출?
gunicorn 문서를 찬찬히 살펴보면 **기본값인 sync worker만을 사용하는 경우, nginx와 같은 proxy 뒤에서 사용하는 것을 권장**한다.
> If you exposed synchronous workers to the internet, a DOS attack would be trivial by creating a load that trickles data to the servers. https://docs.gunicorn.org/en/latest/design.htmla

> The default Sync workers are designed to run behind Nginx which only uses HTTP/1.0 with its upstream servers. If you want to deploy Gunicorn to handle unbuffered requests (ie, serving requests directly from the internet) you should use one of the async workers.  https://docs.gunicorn.org/en/21.2.0/faq.html#why-is-there-no-http-keep-alive

async worker를 사용한다면 nginx같은 reverse proxy가 필요가 없을까 ? 

### nginx의 책임
nginx와 같은 reverse proxy에서의 책임과 gunicorn에서의 책임을 분리할 필요가 있다.  
nginx는 TLS 핸들링, ip spoofing같은 보안 이슈들 혹은 기타 이유로 web applicatin server로 요청이 가지 않도록 처리를 한다.  

gunicorn이 직접 public network에 노출되면 DoS, HTTP Header 신뢰 등 많은 보안 이슈들을 핸들링해야한다.  
그 대신, 관련 이슈를 잘 해결하는 전문가(nginx같은)에게 맞기고, 해당 proxy만을 신뢰하도록 구성하는 것이 안정적이다.  
Django에서는 SECURE_PROXY_SSL_HEADER, gunicorn의 forwarded_allow_ips와 같은 설정값들로 proxy에서 HTTPS 요청을 처리했음을 신뢰할 뿐이다.  
따라서 **public network로는 reverse proxy만 노출해 모든 요청이 proxy를 거치도록 구성한다.**

로컬에서도 구조적으로 동일하도록 구성하려면 reverse proxy가 필요하다.  

## Caddy - 로컬 reverse proxy 구성하기
로컬에서 이런 환경을 구축하기 위해 필요한건 이렇게 정리할 수 있다.  
reverse proxy로서 TLS와 보안 이슈들을 책임져줄 녀석.  

Caddy는 기본적으로 보안 이슈들을 처리해주고, TLS 핸들링도 자동화되어있다.    
nginx를 사용했을 때에 필요한 설정값들을 기본적으로 제공해서 local에서 뚝딱 사용할 수 있고, reverse proxy만 처리해주면 된다.
```bash
# Caddyfile
{
    debug
}

localhost:8080 {
    reverse_proxy localhost:8000 {
      header_up X-Forwarded-Proto https
    }
}
```
localhost:8080으로 들어오는 요청을 localhost:8000로 내보내며, X-Forwarded-Proto 헤더로 요청들이 orignal에서 HTTPS로 왔음을 명시해준다.  

gunicorn Django에는 https를 사용하지 않고, caddy가 보내주는 요청을 신뢰한다.
```python
# settings.py
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO','https')
ALLOWED_HOSTS = ["localhost","127.0.0.1"]
```

이렇게만 구성해도 8080으로 보낸 HTTPS request는 TLS handshake를 마친 후, gunicorn으로 upstream하게 된다.  
<img src="/assets/images/DjangoLocalEnvironSetting/caddy.png" />  


## 마무리  
runserver에서 시작해서 WSGI, gunicorn, reverse proxy까지 순서대로 확인해볼 수 있었다.  
단순히 Django Docs에 있는대로, Caddy Docs에 있는대로 설정하고 "되네" 가 아니라, 전체 구조를 이해함으로 앞으로의 엔지니어링에 가속도를 올려줄 것이라 믿는다 !

