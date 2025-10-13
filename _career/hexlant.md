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
            솔라나는 평균 TPS가 3000이 넘어가는 블록체인 플랫폼입니다.
            <br>한 transaction에는 여러 event가 발생하므로 블록 당 처리해야하는 event는 약 10,000건이 넘어갑니다.
            <br>기존 입금 처리 로직으로는 cron job이 일정 주기마다 쌓인 블록을 처리하는 방식으로 솔라나와 같이 대규모 이벤트를 처리할 수 없습니다.
            <br>솔라나의 높은 TPS와 이벤트 처리량을 감당하기 위해 병렬 처리 아키텍처로 전환했습니다.
        solution:
          - |-
            두 가지 방안을 비교했으며, 최종적으로 BullMQ를 활용해 블록을 병렬 처리하도록 구현했습니다.
            <ul>
              <li>모듈러 연산 기반 Job 분산: 처리할 블록을 job 단위로 분할하는 방식으로, 구현이 단순하고 기존 아키텍처와 유사하다는 장점이 있습니다. 하지만 DB와의 결합도가 높고 job 수 변경 시 도메인과 DB 양쪽에 수정이 필요하며, 특정 job 실패 시 해당 모듈러에 속한 블록 전체 처리가 지연된다는 단점이 있습니다.</li>
              <li>Message Queue 기반 처리 (채택): 아키텍처 변경에 대한 고려가 더 필요했지만, 확장성과 장애 대응이 유연하다는 장점이 있습니다. 실패한 작업만 재처리할 수 있다는 것 또한 큰 장점입니다.</li>
            </ul>
          - |-
            이미 사용 중인 ElasticCache를 기반으로 구축해 인프라 부담을 줄였으며, 처리할 블록 정보를 가져오는 통신 레이어를 추상화해 의존을 역전 시켜 향후 인프라 변경에 용이하도록 설계했습니다.
          - |-
            Message Queue 기반 병렬 처리 구조로 전환하는 비교적 큰 변화였음에도 2주 내에 완료했습니다.
            <br>초기 설계 단계에서 입금 도메인과 블록 처리 도메인을 명확히 분리해 두었고, MQ 도입 시에도 최소한의 수정으로 전환했습니다.
        performance_and_learning:
          - "기존 로직에서는 블록 처리 지연으로 서비스가 불가능했지만, 개선 후에는 블록 생성 후 1초 이내 입금 반영이 가능한 수준으로 개선했습니다."
      
      - title: "Polygon Stake 자산 예치 및 운용"
        role: "API 명세, DB 모델링 설계 및 구현 전반 리드"
        skills: "NestJS, MySQL"
        definition_and_hypothesis:
          - "PoS 합의 알고리즘을 사용하는 블록체인 Validator에 자산을 예치하고 운용하는 프로젝트입니다."
        solution:
          - |-
            Polygon에서 공식 지원하는 Stake API가 없어 직접 contract를 사용해야 했습니다.
            <br>Ethereum 메인넷에 배포된 contract source code를 모두 분석해 기능을 설계 stake 동작을 정리해 공유했습니다.(<a href="https://aepeulstore.notion.site/Polygon-Stake-458b80076670469093a701527b73df8a">https://aepeulstore.notion.site/Polygon-Stake-458b80076670469093a701527b73df8a</a>)
            <br>이를 기반으로, Stake 도메인을 정의하고 제품 솔루션을 기획했습니다.
          - |-
            Stake 도메인의 공통 동작을 추상화 체인 별로의 구체적인 동작을 은닉하는데 초점을 맞춥니다.
            <br>이전의 코드들은 절차 지향적으로, 거대한 로직 중 아주 일부분의 코드를 수정하는 것이 무서웠던 경험들이 있습니다. 이런 경험들로 자주 변경되는 도메인을 분리하고 유지 보수에 용의하도록 개발하는 것을 지향합니다.
        performance_and_learning:
          - |-
            자산 예치, 보상 추적, 출금까지 MVP 기능 2주 내 구현했던 경헙입니다.
            <br>전통 금융권 등의 고객사를 유치하고 제품이 성장하는데 기여했습니다.
          - |-
            좋은 제품을 만들기 위해서는 어떻게 동작하는 지 철저하게 숙지해야한다고 생각합니다.
            <br>문서를 정리하고, 공유함으로 팀원 모두에게 지식을 전파하는 것의 중요성을 배웠습니다.
---
