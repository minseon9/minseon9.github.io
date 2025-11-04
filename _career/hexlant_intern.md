---
company: "(주)헥슬란트"
position: "산학 협력 인턴"
start_date: "2020.03"
end_date: "2021.02"
duration: "1년"
order: 1

project_groups:
  - group_title: "키 보안 솔루션 연구"
    projects:
      - title: "Multi-Party Computation Based Threshold Signature"
        role: "논문 & 오픈 소스 리서치, 제품 PoC 설계 및 구현, 특허 등록"
        skills: "Rust, Rocket, Node.js, Express, MySQL"
        definition_and_hypothesis:
          - |-
            지갑 서비스에서 많이 사용하는 multi-sig는 서명하거나 키를 생성할 때 private key 원형이 노출되는 single point of failure가 존재합니다.
            <br>이러한 구조적 보안 한계를 해결하기 위해, MPC 기반 Threshold Signature(TSS)를 활용한 키 보안 솔루션을 연구했습니다.
            <br>암호학, 분산 시스템, 블록체인 트랜잭션 구조가 교차하는 복합적인 문제로, 단순한 개발 과제를 넘어 연구 수준의 난이도를 요구했습니다.
        solution:
          - |-
            기존의 key 보안 솔루션을 스터디하며 왜 키 보안 솔루션이 왜 필요한 지 먼저 이해했고, 다양한 솔루션들을 탐색했습니다.
            <br>TEE, HSM, MPC 기반 TSS 등 다양한 보안 솔루션을 전방위적으로 탐색하고, 각 접근법의 한계와 적용 가능성을 비교 분석했습니다.
            <ul>
              <li>TEE: HSM과 유사하게 보안성이 높지만 환경 제약이 커 제외했습니다.</li>
              <li>HSM(Hardware Security Module): ncloud HSM과 직접 소통하며 spec256k1기반의 서명을 검증했지만, 용량에 따른 비용 부담이 큽니다.</li>
              <li>MPC based TSS(채택): 오픈 소스 생태계가 성숙하고, 기존의 multi-sig 구조와도 유사해 서비스 반영에 유리합니다.</li>
            </ul>
            논문과 오픈 소스를 리서치하고, 오픈 소스(<a href="https://github.com/ZenGo-X/multi-party-ecdsa">https://github.com/ZenGo-X/multi-party-ecdsa</a>)를 기반으로 블록체인 트랜잭션에 서명하고 전송하는 테스트 진행했습니다.
            <br>동형 암호, Commitment Scheme 같은 개념이나 트랜잭션에 서명하고 서명값을 추가하기 위해 백서 분석까지 리서치 내용들은 모두 문서로 정리해 사내 공유합니다.
          - |-
            기존 web3 라이브러리는 single key 서명만을 지원했기 때문에, 블록체인 별로의 서명 알고리즘을 이해하고 직접 구현해야했습니다.
            <br>secp256k1 기반 ECDSA 특성과 Bitcoin의 Low-S Rule(s → n−s)을 고려한 서명 유효성 검증 로직을 직접 구현했습니다.
          - |-
            고객사의 로컬 머신과 서버 간의 2 party 구성 등 솔루션을 고안해, 제품에서 비트코인, 이더리움 등 지갑 생성부터 출입금까지 PoC를 완료했습니다.
            <br>또한 이 경험을 바탕으로 [DID 서명 및 검증을 이용한 임계 서명 시스템과 방법](등록번호 1023484010000, 2022.01.04) 특허를 등록했습니다.
            <br>특허 아이디어 고안부터 변리사와의 소통까지 전담해 출원했습니다.
        performance_and_learning:
          - |-
            논문·백서·오픈소스를 종합해 각각의 문제들을 해결해나갔습니다.
            <br>본인이 모르는 분야에도 집착하고 도전하고 성취해내며, 책임감을 보여준 귀중한 경험입니다.
          - |-
            왜 필요하며, 기술 선택에 있어 어떤 것들을 고려해야하는 지 등 기술적인 솔루션 탐색에 있어서의 접근법을 익혔습니다.
            <br>인턴 동안의 학습 능력을 인정받았으며, 개발자로 입사해 현역 산업기능요원으로 편입되어 업무를 이어갔습니다.
            <br>Stake, NFT, Hyperledger Fabric 계열의 블록체인 플랫폼 지원 등 새로운 블록체인 기술들을 전담해 리서치 및 구현하는 역할을 담당했습니다.
---
