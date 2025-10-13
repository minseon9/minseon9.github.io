---
layout: career
company: "(주)헥슬란트"
position: "Backend Engineer"
start_date: "2021.03"
end_date: "2023.08"
duration: "2년 5개월"
order: 2

project_groups:
  - group_title: "블록체인 지갑 서비스 개발/운영"
    projects:
      - title: "Solana(솔라나) 입출금 지원 및 입금 아키텍처 개선"
        role: "아키텍처, DB 설계 및 구현 전반 리드"
        skills: "NestJS, MySQL, ElasticCache(Redis), BullMQ"
        definition_and_hypothesis:
          - |-
            기존 입금 처리 로직으로는 cron job이 일정 주기마다 쌓인 블록을 처리하는 방식이었습니다.
            <br>솔라나는 평균 TPS가 3000이 넘어가는 블록체인으로 높은 TPS와 이벤트 처리량을 감당하기 위한 개선이 필요했습니다.
            <br>높은 TPS 대응과 장애 복구, 멱등성 보장 등을 동시에 만족해야하는 문제로, 난이도가 매우 높았습니다.
        solution:
          - |-
            여러 솔루션을 제안하고, 각각 검증해 문제를 해결합니다.  
            <ul>
              <li>Solana Geyser Plugin: Solana Validator에서 특정 주소에 대한 변경, transaction을 필터링해 postgreSQL에 저정합니다. Validator 운영 비용과 추가되는 주소에 대한 동적 업데이트가 안되는 문제가 있습니다.</li>
              <li>모듈러 연산 기반 Job 분산: 처리할 블록을 job 단위로 분할하는 방식으로, 구현이 단순하고 기존 아키텍처와 유사하다는 장점이 있습니다. 하지만 DB와의 결합도가 높고 job 수 변경 시 도메인과 DB 양쪽에 수정이 필요하며, 특정 job 실패 시 해당 모듈러에 속한 블록 전체 처리가 지연된다는 단점이 있습니다.</li>
              <li>Message Queue 기반 처리 (채택): 아키텍처 변경이 필요했지만, 확장성과 장애 대응이 유연하다는 장점이 있습니다. 실패한 작업만 재처리할 수 있다는 것 또한 큰 장점입니다.</li>
            </ul>
          - |-
            AWS SQS, BullMQ 등을 비교해 툴을 선택했습니다.
            <br>Node.js에서 간단하게 Job Queue를 구성할 수 있는 툴이며, ElasticCache를 이미 사용하고 있어 인프라 차원에서의 부담을 줄이기 위해 BullMQ를 선택했습니다.
          - |-
            병렬 처리 환경에서 장애 복구와 동일 입금에 대한 멱등성을 보장해야합니다.
            <br>Redis lock의 문제로 동일 job을 여러번 처리되는 등의 상황을 고려해, 동일 입금에 대해 unique한 식별자로 검증해 멱등성을 보장합니다.
            <br>실패하거나, stalled된 job에 대해 별도 queue로 옮기고, sentry로 통해 모니터링할 수 있도록 custom processor 작성했습니다.
            <br>block height를 job priority로 두어, 실패한 job이 starvation이 일어나지 않도록 했습니다. 
        performance_and_learning:
          - |-
            기존 로직에서는 블록 처리 지연으로 서비스가 불가능했지만, 개선 후에는 블록 생성 1초 이내 입금 반영이 가능한 수준으로 개선했습니다.
          - |-
            PoC 기반으로 각 솔루션(Solana Geyser, 모듈러 Job, Message Queue)을 신속하게 검증했습니다.
            <br>기술적 난제를 신속히 평가하고, 최적 솔루션을 빠르게 채택하며 2주라는 단기간에 구조적 개선을 이뤘습니다.
            <br>문제 해결에서 속도와 안정성을 동시에 달성하는 과정을 배웠습니다.

      - title: "Polygon Stake 자산 예치 및 운용"
        role: "API 명세, DB 모델링 설계 및 구현 전반 리드"
        skills: "NestJS, MySQL"
        definition_and_hypothesis:
          - |-
            PoS 합의 알고리즘을 사용하는 블록체인 Validator에 자산을 예치하고 운용하는 프로젝트입니다.
            <br>Contract 동작에 대한 공식 문서나 API가 없는 매우 제한적인 환경에서 문제를 해결해야했습니다. 
        solution:
          - |-
            테스트넷에서 Transaction을 전파하며, 예치(Deposit)부터 출금(Withdraw)까지 스테이킹 전체 주기에서 어떤 Contract의 어떤 프로시저가 호출되는지 파악했습니다.
            <br>또한, 메인넷에 배포된 Contract의 소스 코드를 분석하여 실제 동작 방식, 기간·금액별 이자 계산 로직, 상수 값 사용 방식 등을 문서화하고 팀 내 공유했습니다.(<a href="https://aepeulstore.notion.site/Polygon-Stake-458b80076670469093a701527b73df8a">https://aepeulstore.notion.site/Polygon-Stake-458b80076670469093a701527b73df8a</a>)
          - |-
            Polygon Stake 웹 서비스에서 제공하는 이자 계산기와 파악한 로직 사이의 오차가 발생했습니다.
            <br>Polygon Stake 웹 서비스에서 api call이 일어나지 않는 것을 파악하고, 브라우저 JS 코드를 분석해 계산방식을 리버싱했습니다.
            <br>일부 값들을 하드코딩해 사용한다는 것을 파악했고, 서비스에 혼란이 없도록 안내했습니다.
          - |-
            이를 기반으로 Stake 도메인을 정의하고 제품 솔루션을 기획했습니다.
            <br>Stake 도메인의 공통 동작을 추상화하여 체인 별로의 구체적인 동작을 은닉하는데 초점을 맞췄습니다.
        performance_and_learning:
          - |-
            공식 API의 부재, Contract 자체에 의존해야하는 구조적 문제로, 일반적인 방식으로는 해결하기 어려웠던 프로젝트입니다.
            <br>제한된 정보와 환경에서 창발적으로 문제를 해결했으며, 가능한 기술적 경로를 탐색하는 실행력과 문제 집착력을 보였습니다.
            <br>이는 불확실한 기술 영역에서도 빠르게 가설을 세우고 검증하는 문제 해결력을 키운 계기가 되었습니다. 
          - |-
            자산 예치, 보상 추적, 출금까지 MVP 기능 2주 내 구현했던 경헙입니다.
            <br>전통 금융권 등의 고객사를 유치하고 제품이 성장하는데 기여했습니다.
---
