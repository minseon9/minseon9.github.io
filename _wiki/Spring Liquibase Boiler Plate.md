---
layout      : single
title       : 
summary     : 
date        : 2025-09-15 16:41:53 +0900
updated     : 2025-09-15 17:59:20 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 6748C8D5-C958-41D2-89DF-809AA087F763
---
* TOC
{:toc}

# Spring DB Migration 

## 요구 사항
env
kotlin 2.11
gradle (multi project) 8.11.4
spring 3.5

db migrations management tool 비교.
아래의 요구사항을 충족해야함

[must] gradle multi project를 지원할 수 있어야함. 
[must] migrations file을 자동으로 생성해줘야함.
[must] update와 roll back이 쉬워야함 (migration 관리)
[must] 무료로 사용할 수 있어야함
[opiontal] Django의 migration처럼 각 도메인 별로 migrations를 관리할 수 있어야함. Django에서 app label를 달아주면 다른 app의 변경사항은 무시하고 해당 app 내부의 변경 사항만 migrations file로 만들어주는 것.
  
 
## tool 비교
flywayd와 liquibase


## liquibase trouble shooting

search path 설정
- relative path를 찾도록

class path
- build 된 것을 기준으로 scan

referenceUrl
- hibernate:spring
- hibernate:ejb3


classpath는 “어떤 클래스/리소스를 로딩할 수 있냐”의 문제. (= 전체 빌드 산출물 + dependencies)

hibernate:spring: referenceUrl은 Spring Boot가 로딩하는 JPA 설정(= EntityScan 대상 패키지, Dialect, properties)을 기준으로 Hibernate 엔티티 메타모델을 구성.

따라서 migration 시점에 실제로 어떤 엔티티가 로딩되느냐는 Spring의 엔티티 스캔 범위에 달려 있고,
classpath는 단순히 "거기에 접근할 수 있게만" 해주는 역할이에요.


"다른 패키지 엔티티도 스캔은 하지만 무시한다?" → ❌ 아예 스캔 자체를 안 합니다.
db에는 a, b, c 서브 프로젝트의 entity들이 테이블로 마이그레이션 되어 있음 > b 서브프로젝트에서 entity에 변경을 하고 마이그레이션 파일을 만들면, b 서브 프로젝트 기준으로는 a, c의 entity에 대응하는 테이블이 없기 때문에 해당 테이블들을 drop하는 migration을 생성


구조 개선 
> main project는 모든 서브 프로젝트들을 include하기 때문에 spring에서 entity들을 scan할 수 있음
> main project를 기준으로 마이그레이션 파일을 적절한 위치에 생성(cli로 option을 받아야함)
> diffIncludeObjects로 scan할 entity들을 지정. hibernate를 직접 사용해 해당 도메인 하위의 entity들만 추출
> 모든 entity들이 scan이 되어서 변경지점은 잡히지만, include된 녀석에 대해서만 migration file을 생성


