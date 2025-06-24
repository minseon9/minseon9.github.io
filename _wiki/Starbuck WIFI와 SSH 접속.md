---
layout      : single
title       : 스타벅스 WIFI에서 Github push가 안된다.
summary     : 
date        : 2025-06-24 23:01:23 +0900
updated     : 2025-06-24 23:06:10 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : C15A9C87-0602-4AAC-A545-FCBA2DD68CF6
---
* TOC
{:toc}

#

스타벅스 와이파이 연결
Github push를 했는데 안된다.

ssh port로 peer to peer 연결이 안된다나 뭐라나

조금 찾아보니 대부분 중국인들이 남긴 이슈들이었다.
중국인들 ..?
SSH port인 22가 아니라 HTTPS port인 443으로 연결 ..?
네트워크 통신에서 뭔가 22번 포트로 통신을 막은 것 같은데 ?

핫스팟을 연결하니 push가 잘 올라간다.



용산 스타벅스 리저브에서 스타벅스 와이파이 사용
✘ yeseo@iyeseos-MacBook-Pro  ~/minseon9.github.io  ↱ master  git push
kex_exchange_identification: read: Connection reset by peer
Connection reset by 20.200.245.247 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.


이슈를 찾아보니, 대부분 중국인들이 겪는 문제
https://github.com/orgs/community/discussions/55269

해결은
SSH over HTTPs port
즉, 22 port가 아니라 443 port로 SSH 접속
https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port


와이파이의 방화벽이나 VPN같은 이슈인가?
핫스팟 연결해서 시도하니 성공

 ✘ yeseo@iyeseos-MacBook-Pro  ~/minseon9.github.io  ↱ master  git push
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 12 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 402 bytes | 402.00 KiB/s, done.
Total 4 (delta 3), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To github.com:minseon9/minseon9.github.io.git
   269e8fc4..c014c28c  master -> master
