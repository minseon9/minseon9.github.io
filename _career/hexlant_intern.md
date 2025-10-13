---
layout: career
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
            Multi-Party Computation(MPC)은 연산에 참여하는 각 party의 input이 들어나지 않은 채로 모든 party가 동일한 결과들 얻도록 하는 연산 방식입니다.
            <br>지갑 서비스에서 가장 중요한 비밀값은 private key입니다. 대게의 경우 multi-sig를 사용해 private key를 분산 보관합니다. 하지만 서명하거나 키를 생성할 때 private key 원형이 노출되는 single point of failure가 존재한다는 단점이 있습니다.
            <br>이런 보안 이슈를 극복하기 위해 MPC를 활용합니다.
        solution:
          - |-
            논문과 오픈 소스를 리서치하고, 오픈 소스(<a href="https://github.com/ZenGo-X/multi-party-ecdsa">https://github.com/ZenGo-X/multi-party-ecdsa</a>)를 기반으로 블록체인 트랜잭션에 서명하고 전송하는 테스트 진행했습니다.
            <br>동형 암호, Commitment Scheme 같은 개념이나 트랜잭션에 서명하고 서명값을 추가하기 위해 백서 분석까지 리서치 내용들은 모두 문서로 정리해 사내 공유합니다.
          - |-
            고객사의 로컬 머신과 서버 간의 2 party 구성 등 솔루션을 고안해, 제품에 반영한 PoC를 진행했습니다.
            <br>비트코인, 이더리움 등 지갑 생성부터 출입금까지 PoC를 완료했습니다.
          - |-
            이 경험을 바탕으로 [DID 서명 및 검증을 이용한 임계 서명 시스템과 방법](등록번호 1023484010000, 2022.01.04) 특허를 등록했습니다.
            <br>특허 아이디어 고안부터 변리사와의 소통까지 전담해 출원했습니다.
        performance_and_learning:
          - |-
            학부생 시절 인턴으로 시작해, 하나하나 만들어가면서 성취감과 책임감을 느낀 귀중한 경험입니다.
            <br>본인이 모르는 분야에도 도전하고, 성취하는 과정을 즐깁니다.
          - |-
            인턴 동안의 학습 능력을 인정받았으며, 개발자로 입사해 현역 산업기능요원으로 편입되어 업무를 이어갔습니다.
            <br>Stake, NFT, Hyperledger Fabric 계열의 블록체인 플랫폼 지원 등 새로운 블록체인 기술들을 전담해 리서치 및 구현하는 역할을 담당했습니다.
---
