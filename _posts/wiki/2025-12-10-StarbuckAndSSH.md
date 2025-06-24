---
layout		: single
title		: 
summary	: 
date		: 2025-12-10 16:53:28 +0900
updated	: 2025-12-10 17:11:45 +0900
category	: 
tags		: 
toc		: true
public		: true
parent		: 
latex		: false
resource	: 7EF219AF-CE03-437C-A338-E5D559467407
author_profile :  false
classes	:  wide
---
Using Starbuck Secure WIFI, then when i commanded git push on terminal, it failed with this message 
kex_exchange_identification: read: Connection reset by peer
Connection reset by 20.200.245.247 port 22 +fatal: Could not read from remote repository.
Please make sure you have the correct access rights ~.

I think git push using 22 port for ssh and starbucks network block requests from this port.

What i wanna do is 
1. how SSH works.
2. what block this request exactly and how.


----


Starbucks WiFi is very likely blocking outbound TCP port 22, so the TCP connection for SSH starts and then a middlebox (firewall) immediately kills it, which shows up in SSH as `kex_exchange_identification: read: Connection reset by peer` and “Could not read from remote repository.”[1][2][3]

## 1. How SSH works

SSH is a TCP-based, client–server protocol where the client (your laptop) connects to an SSH server, usually on TCP port 22.[4][5][6]

- After the TCP handshake, SSH does:
  - Protocol version exchange (client/server tell each other their SSH versions).[6][4]
  - Key exchange (KEX): client and server negotiate algorithms and run a Diffie–Hellman–style exchange to derive a shared secret session key.[7][4][6]
  - Server authentication: the client verifies the server’s host key (the “authenticity of host … can’t be established” prompt you see the first time).[5][6]
  - User authentication: typically via public key (your `id_rsa` or `ed25519`) or password.[8][5]
- After that, all data (terminal I/O, git traffic, scp, port forwarding) goes through this encrypted SSH channel, using symmetric crypto and MACs for confidentiality and integrity.[9][4][5]

When you run `git push` over an SSH remote (`git@github.com:...`), Git is just spawning `ssh` and speaking its own protocol over that already-encrypted SSH tunnel.[5][8]

## 2. What is blocking and how

On public WiFi, there is usually a captive portal plus one or more firewalls/NAT devices between you and the Internet; these devices can enforce “walled garden” policies by allowing only certain destination ports (typically 80/443) and blocking others like 22.[3][10][11]

In your case:

- Your client sends a TCP SYN to `20.200.245.247:22` (GitHub/GitLab-like IP, SSH port).  
- The Starbucks/ISP firewall sees an outgoing connection to port 22 and either:
  - Immediately sends back a TCP RST, or  
  - Silently drops the packet or subsequent packets.  
- SSH starts its key-exchange phase but then reads a RST / gets the connection torn down, so it reports `kex_exchange_identification: read: Connection reset by peer` and Git reports “Could not read from remote repository.”[12][13][1]

This behavior matches known reports that Starbucks and similar public hotspots block SSH (port 22) at their edge firewalls to limit remote administration and tunneling.[14][2][10][3]

If you want, next step could be:  
- Test `ssh -T git@github.com` on Starbucks vs your home WiFi to confirm.[11]
- Use HTTPS remotes (`https://github.com/...`) for Git or an SSH server listening on a “web-looking” port such as 443, depending on what the service supports.[2][11]

[1](https://github.com/orgs/community/discussions/58249)
[2](https://stackoverflow.com/questions/32669420/gitlab-ssh-via-public-wifi-port-22-blocked)
[3](https://www.reddit.com/r/starbucks/comments/a9fy5u/starbucks_internet_port_blocking/)
[4](https://en.wikipedia.org/wiki/Secure_Shell)
[5](https://www.ssh.com/academy/ssh/protocol)
[6](https://www.digitalocean.com/community/tutorials/understanding-the-ssh-encryption-and-connection-process)
[7](https://monovm.com/blog/ssh-protocol/)
[8](https://www.hostinger.com/tutorials/what-is-ssh)
[9](https://www.cloudflare.com/learning/access-management/what-is-ssh/)
[10](https://forum.level1techs.com/t/an-interesting-problem-of-wifi-ssh/124285)
[11](https://stackoverflow.com/questions/15589682/how-to-fix-ssh-connect-to-host-github-com-port-22-connection-timed-out-for-g)
[12](https://phoenixnap.com/kb/fix-connection-reset-by-peer-ssh-error)
[13](https://velog.io/@youngerjesus/Connection-Reset-by-Peer-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0)
[14](https://forums.macrumors.com/threads/cyberduck-ssh-on-public-wifi-port-22-blocking.991648/)
[15](https://stackoverflow.com/questions/69394001/how-can-i-fix-kex-exchange-identification-read-connection-reset-by-peer)
[16](https://leechwin.tistory.com/entry/Git-sshexchangeidentification-read-Connection-reset-by-peer-%EC%97%90%EB%9F%AC-%EB%B0%9C%EC%83%9D%EC%8B%9C)
[17](https://github.com/orgs/community/discussions/27289)
[18](https://support.huaweicloud.com/intl/en-us/ecs_faq/ecs_faq_0529.html)
[19](https://1gbits.com/blog/how-to-fix-connection-reset-by-peer-ssh-error/)
[20](https://discourse.charmhub.io/t/keeping-a-vpn-in-your-pocket-ported-over/2498)



질문한 이해가 거의 맞습니다. 조금 더 정확히 말하면, **TCP 연결 위에 SSH “세션”이 하나 올라가고, 그 세션 안에 여러 “채널”을 만들 수 있고, 그중 하나가 터미널(원격 셸) 채널**입니다.[3][5]

## SSH 세션 & 채널 구조

- TCP 연결이 맺어지면 그 위에 **SSH 세션(보안 연결)** 이 하나 생깁니다.  
  이 세션은 암호화, 무결성, 서버·클라이언트 인증 등을 담당하는 “보안 파이프”라고 보면 됩니다.[6][7][3]
- 그 다음부터는 이 세션 위에서 **여러 개의 논리적 채널(channel)** 을 열 수 있습니다.  
  예:  
  - 터미널 채널: 원격 셸(터미널에 명령 치고 결과 받는 것)[5][3]
  - 포트 포워딩 채널: `-L`, `-R` 같은 SSH 터널링  
  - 파일 전송(SCP/SFTP) 채널 등

즉, **“세션 = 암호화된 파이프 하나, 채널 = 그 파이프 안에서 멀티플렉싱하는 논리적인 스트림”** 구조입니다.[7][3]

## 터미널에서 보이는 것과 데이터 흐름

터미널에서 `ssh user@host`로 접속하면 일반적으로 이렇게 됩니다.

1. SSH 세션이 설치되고, 그 안에 **터미널용 채널 1개(session channel)** 이 열립니다.[3][5]
2. 이 채널과 로컬 터미널이 1:1로 연결됩니다.
   - 로컬에서 키보드로 입력한 바이트 → 터미널 → SSH 클라이언트 → 해당 채널로 캡슐화 → 암호화 → TCP로 전송 → 서버에서 복호화 → 그 채널에 연결된 원격 `bash`/`zsh` stdin으로 들어감.  
   - 서버에서 `bash`/`zsh` stdout/stderr에 출력한 바이트 → SSH 서버가 채널에 실어 보냄 → 암호화 → TCP → 로컬에서 복호화 → 해당 채널의 데이터가 터미널에 출력.[8][5][3]
3. 그래서 **“원격에서 실행 중인 셸 프로세스의 표준 입출력(표준입력/표준출력/표준에러)이 SSH 채널에 붙어 있고, 이 채널이 다시 로컬 터미널에 연결되어 있다”**고 이해하면 됩니다.

여기서 포인트는:

- “세션 & 채널에서 원격 접속한 터미널에 정보를 제공한다”  
  → 더 정확히는, **원격 셸 프로세스의 입출력이 SSH 채널을 통해 암호화되어 로컬 터미널과 연결되는 구조**입니다.  
- 하나의 SSH 세션 내에 터미널 채널 말고 다른 채널도 동시에 존재할 수 있고, 모두 같은 세션 키로 암호화되지만, 논리적으로는 독립된 스트림입니다.[5][7][3]

[1](https://velog.io/@ragnarok_code/SSH-%EB%8F%99%EC%9E%91%EC%9B%90%EB%A6%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
[2](https://blog.naver.com/joje3029/223390866901)
[3](https://ojt90902.tistory.com/1797)
[4](https://veneas.tistory.com/entry/Linux-%EB%A6%AC%EB%88%85%EC%8A%A4-ssh-%EB%8F%99%EC%9E%91-%EB%B0%A9%EC%8B%9D-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%82%AC%EC%9A%A9%EB%B2%95)
[5](https://berom.tistory.com/262)
[6](https://thisisjoos.tistory.com/754)
[7](https://itsmineve.tistory.com/37)
[8](https://somaz.tistory.com/17)
[9](https://richwind.co.kr/218)
[10](http://itwiki.kr/w/SSH)



네, 그 흐름 그대로 이해하면 됩니다. 다만 “요청–응답”이라기보다, **양쪽이 바이트 스트림을 계속 밀어 넣는 양방향 파이프**라고 보는 게 더 정확합니다.[1][2]

## 데이터 흐름 정리

- 출력 방향 (원격 → 내 터미널)  
  1. 원격 서버에서 셸(bash, zsh 등)이 stdout/stderr로 텍스트를 출력.  
  2. SSH 서버가 그 바이트들을 해당 채널에 실어서 암호화하고 TCP로 전송.  
  3. 내 SSH 클라이언트가 복호화 후, 그 채널 데이터를 로컬 터미널에 써 줌.  
  → 그래서 “원격 터미널 내용이 내 터미널에 그대로 뿌려지는” 것처럼 보임.[3][4][1]

- 입력 방향 (내 터미널 → 원격)  
  1. 내가 키보드에 입력한 바이트가 로컬 터미널 → SSH 클라이언트로 전달.  
  2. SSH 클라이언트가 그 바이트를 채널 패킷으로 싸서 암호화, TCP로 전송.  
  3. SSH 서버가 복호화 후, 그 채널과 연결된 원격 셸의 stdin으로 전달.  
  4. 셸이 그 입력을 명령으로 해석해서 실행.[2][5][1]

즉:

- **내 입력**은 SSH 채널을 통해 원격 셸의 stdin으로 가서 실행되고,  
- **원격 셸의 출력**은 같은 채널을 통해 돌아와 내 터미널에 그대로 찍힙니다.  

이 모든 왕복이 하나의 SSH 세션(암호화된 파이프) 위에서, 해당 터미널 채널을 통해 이루어지는 구조입니다.[1][2]

[1](https://ojt90902.tistory.com/1797)
[2](https://berom.tistory.com/262)
[3](https://thisisjoos.tistory.com/754)
[4](https://somaz.tistory.com/17)
[5](https://itsmineve.tistory.com/37)

----


`git push`를 SSH 리모트(`git@github.com:...`)로 날리면, **로컬 Git → ssh 클라이언트 → SSH 세션 수립 → SSH 위에서 Git 전용 프로토콜 교환** 순서로 통신이 오갑니다.[1][2][3]

## 1. git push 시 SSH에서 일어나는 일

`git push` 입력 시, 대략 이런 흐름이 발생합니다.

1. Git이 내부적으로 `ssh` 실행  
   - `ssh -x -o ... git@github.com 'git-receive-pack <repo-path>'` 같은 형태로 SSH를 호출해서, 원격에서 Git 서버 프로세스(`git-receive-pack`)를 띄우도록 요청합니다.[2][1]

2. SSH 세션 수립  
   - TCP 22(또는 설정된 포트)로 접속 → 버전 교환 → 키 교환(KEX) → 서버/클라이언트 인증 → 암호화된 SSH 세션 생성.[3][4][1]

3. SSH 채널에서 Git 프로토콜 교환  
   - SSH 서버 측에서 `git-receive-pack`이 실행되고,  
   - 로컬 Git과 원격 Git이 **Git wire protocol**(레퍼런스 광고, 오브젝트 전송, packfile 전송 등)을 SSH 채널 위에서 주고받습니다.[1][2]
   - 이때 실제로는 모든 Git 데이터는 SSH가 제공하는 암호화된 바이트 스트림을 통해 흐릅니다.

4. 완료 후 SSH 세션 종료  
   - Git 프로세스 종료 → SSH 채널/세션 닫힘 → TCP 연결 FIN.

요약하면:  
**Git은 SSH를 “암호화된 파이프”로 사용하고, 그 파이프 안에서 Git 고유 프로토콜로 레퍼런스/오브젝트를 주고받는 구조**입니다.[2][1]

## 2. 통신 내용을 확인하는 방법

### A. Git/SSH 디버그 출력으로 논리 흐름 보기

1. Git 레벨 디버그  
   ```bash
   GIT_TRACE=1 GIT_SSH_COMMAND="ssh -v" git push
   ```
   - `GIT_TRACE=1` (또는 `GIT_TRACE_PACKET=1`, `GIT_TRACE_PACK_ACCESS=1` 등)을 쓰면 Git이 어떤 명령을 어떻게 실행하는지, Git 프로토콜 레벨에서 어떤 패킷이 오가는지 텍스트로 로그를 뿌려 줍니다.[5]
   - `GIT_SSH_COMMAND="ssh -v"` 로 SSH의 verbose 출력(-v)을 켜면, 키 교환, 인증, 채널 오픈 등 SSH 단계도 같이 볼 수 있습니다.[5]

2. SSH 단독 디버그  
   ```bash
   ssh -v git@github.com
   ```
   - 순수 SSH 연결이 어떻게 진행되는지(키 교환, 호스트키, 인증 등)를 확인할 수 있습니다.[5]

### B. 패킷 캡처로 실제 TCP/SSH 레벨 보기

SSH는 암호화되어 내용(payload)을 평문으로 볼 수는 없지만, **TCP 핸드셰이크, 포트, 패킷 흐름**은 볼 수 있습니다.

- `tcpdump` 예시:  
  ```bash
  sudo tcpdump -i any tcp port 22
  ```
  - 3-way handshake, SSH 버전 교환, 암호화된 패킷들이 어떻게 오가는지 확인 가능.[6][7]

- `Wireshark`  
  - 필터: `tcp.port == 22`  
  - 패킷 레벨에서 SSH 프로토콜 레이어(Protocol 컬럼에 SSH)까지 구분해서 볼 수 있음.[7][6]

### C. Git 프로토콜 레벨까지 더 깊게

- `GIT_TRACE_PACKET=1`  
  ```bash
  GIT_TRACE_PACKET=1 GIT_SSH_COMMAND="ssh -v" git push
  ```
  - 레퍼런스 광고(`want`, `have`, `done` 등)와 packfile 전송 시점 등을 텍스트 레벨에서 확인할 수 있습니다.[5]

***

정리하면:

- `git push` → SSH 세션 수립 → 그 위에서 Git wire protocol로 레퍼런스/오브젝트 교환.  
- **SSH 단계**는 `ssh -v` / `GIT_SSH_COMMAND`로,  
- **Git 프로토콜 단계**는 `GIT_TRACE`, `GIT_TRACE_PACKET`로,  
- **TCP/패킷 레벨**은 `tcpdump`나 Wireshark로 각각 확인할 수 있습니다.[6][7][1][5]

[1](https://www.ssh.com/academy/ssh/protocol)
[2](https://www.hostinger.com/tutorials/what-is-ssh)
[3](https://www.digitalocean.com/community/tutorials/understanding-the-ssh-encryption-and-connection-process)
[4](https://en.wikipedia.org/wiki/Secure_Shell)
[5](https://stackoverflow.com/questions/15589682/how-to-fix-ssh-connect-to-host-github-com-port-22-connection-timed-out-for-g)
[6](https://phoenixnap.com/kb/fix-connection-reset-by-peer-ssh-error)
[7](https://1gbits.com/blog/how-to-fix-connection-reset-by-peer-ssh-error/)


----


https://www.reddit.com/r/starbucks/comments/a9fy5u/starbucks_internet_port_blocking/


누가 22번을 막는가?
구현 패턴 몇 가지:

단순형:

매장 라우터/게이트웨이(스타벅스 설치 장비)에서 바로 “outbound 22 deny” 같은 룰로 차단.

통신사 주도형 (질문한 케이스에 가까움):

스타벅스는 KT의 “공용 WiFi 전용 회선 상품”을 쓰고,

KT의 캐리어급 방화벽에서 포트 정책을 적용 → 모든 매장이 공통 정책을 공유.​

본사 집중형:

매장 → KT 회선 → 스타벅스 본사 VPN/데이터센터 → 본사 방화벽 → 인터넷

이때 본사 방화벽에서 22번 차단.


질문한 구조는 “매장 트래픽을 먼저 스타벅스 본사 쪽으로 모아서, 본사 방화벽을 거쳐 인터넷으로 내보내는 엔터프라이즈형 WAN + VPN 아키텍처”라고 보면 됩니다. 이걸 이해하려면 WAN, VPN, 라우팅, 방화벽 개념들이 같이 필요합니다.[1][2][3]

## 1. 구조 흐름 개요

가정한 경로를 풀면 이렇게 됩니다.

> 매장 WiFi/유선 → 매장 라우터 → **KT 액세스망** → 스타벅스 **본사 VPN/데이터센터(집중 허브)** → **본사 방화벽** → 인터넷

- 매장–본사 사이를 **VPN 터널(IPsec, SSL VPN 등)** 로 묶어서, 논리적으로 “하나의 사설 네트워크(기업 WAN)”처럼 사용.[1]
- 모든 인터넷 트래픽(웹, SSH 등)을 **본사로 먼저 보내고**, 본사에서 정책(포트 제한, 로그, 보안 검사)을 적용한 뒤 외부 인터넷으로 라우팅.[3][1]

## 2. 단계별로 보면

### (1) KT 회선: 액세스망 / L3 연결

- 각 매장은 KT의 전용 회선, 광인터넷, MPLS/VPN 등으로 **L3 수준의 연결**을 본사까지 가집니다.[1]
- 여기서 KT는 단순히 “IP 패킷을 매장 ↔ 본사 사이에 전달하는 역할”을 하고, 그 위에 스타벅스가 VPN을 올릴 수도, L3 VPN(통신사 MPLS VPN)을 쓸 수도 있습니다.

참고 지식:
- WAN, MPLS VPN, L3 VPN, ISP 액세스망, BGP/OSPF 같은 라우팅 프로토콜.[1]

### (2) 스타벅스 본사 VPN/데이터센터

- 매장 라우터와 본사 VPN 게이트웨이가 **IPsec VPN 같은 터널** 을 형성.  
  - 매장에서 나오는 패킷(예: 10.10.1.23 → github.com:22)은 먼저 **VPN 게이트웨이(IPsec 터널의 “암호화 끝점”)** 으로 캡슐화되어 전송.[1]
  - KT망 안에서는 “암호화된 외피를 쓴 IP 패킷”만 보이고, 실제 내부(사설 IP, 앱 포트 등)는 보이지 않음.
- 본사 측에서 이 VPN을 받아서 **사설 주소(예: 10.10.1.0/24 매장 네트워크)** 로 복원한 뒤, 내부 라우팅 테이블에 따라 처리.[2][1]

참고 지식:
- VPN 기본(특히 IPsec: 터널 모드, ESP, IKE 교환).  
- 사설 IP, NAT, 터널링(Encapsulation), Site-to-Site VPN 개념.  
- 엔터프라이즈 WAN 구조, 허브–스포크 vs 풀메시.[2][1]

### (3) 본사 방화벽

- 본사 데이터센터 앞단에 **기업용 방화벽/UTM** 이 위치.[3]
  - 인바운드/아웃바운드 모두에 대해 정책 작성 가능.  
  - “모든 매장망(10.10.x.x)에서 나가는 TCP 22는 차단”, “웹(80/443)만 허용” 같은 룰을 여기에 둠.[3]
- 방화벽은 라우터 역할도 겸하거나, 별도의 코어 라우터와 연동됩니다.
  - 패킷 흐름: 매장에서 온 복호화된 패킷 → 방화벽 정책 검사 → 허용이면 NAT/라우팅 → 외부 인터넷(예: GitHub)으로 전송.[3]
  - 차단이면 드롭 또는 RST/ICMP 반환.

참고 지식:
- 방화벽 개념: ACL, stateful inspection, 포트/프로토콜 기반 정책.  
- NAT (특히 여러 매장 사용자가 하나의 공인 IP로 나가는 PAT).  
- DMZ, 내부망/외부망 분리 구조.[3]

## 3. 이 구조의 의미 (왜 이렇게 쓰나)

- **보안/통제 일원화**: 각 매장 공유기마다 제각각 정책을 두는 대신, 본사 방화벽에서 모든 매장의 인터넷 트래픽을 통제.[1][3]
- **로그/감사**: 어느 매장, 어느 단말에서 어떤 사이트/포트로 나갔는지 중앙에서 로깅 가능.  
- **기업 정책 적용**: SSH, P2P, 토렌트, 특정 국가 IP, 특정 앱 트래픽 등을 중앙에서 일괄 차단.

## 4. 참고하면 좋은 전공 지식 목록

이 구조를 완전히 이해하려면, 아래 키워드를 차례대로 보는 게 좋습니다.

- 네트워크 기초  
  - OSI / TCP-IP 계층, 라우터 vs 스위치 vs 게이트웨이.[1]
  - IP 라우팅, 서브넷, 게이트웨이, NAT.

- WAN / ISP / 엔터프라이즈 네트워크  
  - WAN, MPLS, L3 VPN, Site-to-Site VPN.  
  - 허브–스포크 구조, SD-WAN 개념 (중앙 정책, 여러 회선 가상화).[1]

- VPN / 터널링  
  - IPsec VPN (터널 모드, ESP, 보안 게이트웨이).  
  - SSL VPN, GRE 터널 등 “IP 위에 IP를 싣는” encapsulation 개념.[1]

- 보안 장비 / 정책  
  - Stateful 방화벽, UTM, NGFW.  
  - ACL, 세션 테이블, 애플리케이션 레벨 필터링.  
  - 본사에서 공용 WiFi 트래픽을 제어하는 정책 설계 패턴.[3]

이걸 하나의 그림으로 요약하면:

> 매장 LAN(사설 IP) → 매장 라우터 → KT 회선(단순 운반) → 본사 VPN 게이트웨이(복호화, 내부망으로 편입) → 본사 방화벽(정책/로그) → 인터넷

그리고 “22번 포트 차단” 같은 건 이 본사 방화벽 정책에서 한 줄로 표현되는 부분이라고 보면 이해가 잘 맞습니다.[4][5][3]

[1](https://upcurvewave.tistory.com/683)
[2](https://somaz.tistory.com/17)
[3](http://itwiki.kr/w/SSH)
[4](https://www.reddit.com/r/starbucks/comments/a9fy5u/starbucks_internet_port_blocking/)
[5](https://forum.level1techs.com/t/an-interesting-problem-of-wifi-ssh/124285)


---

네, 그 이해가 기본적으로 맞습니다. “물리적으로는 밖에 있지만, 논리적으로는 그 내부 사설망에 붙어 있는 것처럼 동작하게 만드는 기술”이 VPN입니다.[2][7][8]

## 개념적으로 어떻게 보이는지

- VPN에 붙으면 내 PC/노트북은 **그 사설망 대역의 IP(예: 10.x.x.x, 192.168.x.x)** 를 하나 더 받습니다.[8][2]
- 그 상태에서 사설망 내부 서버(예: 10.0.0.5)에 패킷을 보내면:
  - 실제로는 인터넷을 통해 VPN 서버까지 가고,  
  - VPN 서버에서 “마치 내부에서 온 패킷처럼” 사설망 안으로 라우팅됩니다.[6][2][8]
- 결과적으로, 내가 집·카페에 있어도 **본사/사설망 안에 있는 클라이언트처럼 통신**할 수 있습니다.  
  (단, 정확히 어떤 자원에 접근 가능한지는 라우팅/방화벽 정책에 따라 달라짐.)

## 동작 방식 한 줄 요약

- 내 실제 패킷(IP, TCP, 앱 데이터)을 **다른 IP 패킷 안에 캡슐화해서** VPN 서버로 보내고,  
- VPN 서버가 그걸 풀어서 사설망 내부로 전달하는 구조라서,  
- 외부에서 보면 “VPN 서버 ↔ 사설망 내부”만 보이고, 내 단말은 마치 내부에 직접 물려 있는 것처럼 보이게 됩니다.[7][2][8]

## 이걸 이해할 때 도움 되는 전공 키워드

- 사설 IP / 공인 IP, NAT  
- 터널링(Encapsulation), IP-in-IP, IPsec, SSL VPN  
- 라우팅(어떤 목적지 IP는 VPN 인터페이스로 보내는지), 기업 인트라넷 구조  
- 보안: 암호화, 인증(아이디/비밀번호, 인증서, 토큰 등)[5][2][8]

즉, **물리 회선은 인터넷(공중망)을 타지만, 논리적으로는 사설망 안에 있는 것처럼 만들어 주는 “가상 전용선 + 암호화 터널”** 이라고 보면 됩니다.[2][7][8]

[1](https://surfshark.com/ko/learn/what-is-vpn)
[2](https://blog.naver.com/haionnet486/221533140055)
[3](https://www.sentinelone.com/ko/cybersecurity-101/cybersecurity/virtual-private-networks-vpns/)
[4](https://wikidocs.net/278911)
[5](https://csexy-1365.tistory.com/271)
[6](https://change-words.tistory.com/entry/private-network-communicate-vpn)
[7](https://namu.wiki/w/%EA%B0%80%EC%83%81%20%EC%82%AC%EC%84%A4%EB%A7%9D)
[8](https://aws-hyoh.tistory.com/161)
[9](https://velog.io/@agnusdei1207/vpn-%EC%9B%90%EB%A6%AC-%EC%89%AC%EC%9A%B4-%EB%B2%84%EC%A0%84)
[10](https://docs.tosspayments.com/resources/glossary/vpn)
