---
layout		: single
title		: Transaction Script is Anti-pattern ?
summary	        : 
date		: 2025-11-10 12:33:23 +0900
updated	        : 2025-11-10 18:16:38 +0900
category	: "Application Architecture Pattern"
tags		: ["Transaction Script"]
toc		: true
public		: true
parent		: 
latex		: false
resource	: 022F1457-FDFF-4202-A9E7-6DF62FE548B5
author_profile :  false
classes	:  wide
---

# Who Needs an Architecture
[Who Needs an Architecture](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf)는 마틴 파울러의 짧은 에세이다.  
여기서 가장 눈에 띄는 내용은 [Getting rid of software architecture](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf#page=2) 였다.  

아키텍쳐는 중요하다고 합의한 선택 그 자체이다. 어떤 프레임워크를 사용하고, 데이터베이스를 사용할 것이며 도메인 로직들은 어떻게 표현할 것이며 등등.
하지만 언제든지 잘못된 선택을 할 수 있고, 이 중요했던 아키텍쳐를 버리고 변경할 준비를 해야한다.  
우리가 해야할 일은 그 선택의 변경 불가능성을 줄이는 것이다.  


프로젝트를 시작하면서 어떻게 구현할까를 고민할때면 특정 application pattern들을 당연한 정답으로 간주했다.  
하지만 만병통치약은 없다.  
어떤 문제를 해결하려고 하는 지, 그 문제를 어떻게 표현하려고 하는 지에 따라 선택은 달라진다.  
하지만 그 선택 또한 어떤 이유에서든 부족할 수 있고, 부족해질 수 있다.  
아키텍처 패턴 역시 변경 가능한 것이어야 한다.  

그런 관점에서 아키텍쳐 패턴들을, 여기서는 Transaction Script, 재고해보았다.  

---  

# Transaction Script
엔지니어의 주된 관심사는 "도메인 로직을 어떻게 나열할 것이냐" 이다.  
[Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html)는 그 방안 중 하나이다.  
> Most business applications can be thought of as a series of transactions.  
> A Transaction Script organizes all this logic primarily as a single procedure, making calls directly to the database or through a thin database wrapper.  

모든 도메인 로직들은 어떤 행위들의 모음이다.  
가령, (아주 간단한) 계좌 이체를 한다고 하면 아래와 같은 각각의 행위들이 일어난다.

1. 출금 계좌와 입금 계좌를 조회
2. 요청된 금액에 수수료를 더하여 실제 출금되어야 할 총 금액을 계산
3. 출금 계좌의 잔액이 이 총 금액보다 크면, 출금 계좌와 입금 계좌의 잔액을 업데이트
4. 잔액이 충분하지 않은 경우, 오류

이 행위들을 프로그래밍 언어로 옮기는 가장 직관적인 방법은 행위들을 그대로 서술하는 것이다.  
Transaction Script는 일련의 행위를 그대로 표현하는 것으로 도메인 로직을 나열한다.  

{% capture Pesudo %}
function execute() {
    get data from DB
    do some business logic 
    
    write some data to DB 
    some more business logic 
    
    if some condition then
        some more DB access 
        some more business logic 
        some more DB access 
    else
        some more business logic 
        some more DB
}
{% endcapture %}

{% capture Example %}
function transferMoney(SenderID, ReceiverID, Amount) {
    // 1. get data from DB (계좌 조회)
    SenderAccount = Database.getAccount(SenderID)
    ReceiverAccount = Database.getAccount(ReceiverID)
    
    // 2. do some business logic (수수료 및 총 출금액 계산)
    TransactionFee = Amount * 0.05 // 5% fee calculation
    TotalWithdrawal = Amount + TransactionFee
    
    // 3. Conditional Check (잔액 부족 시 오류 반환)
    if (SenderAccount.Balance < TotalWithdrawal) {
        throw Exception("Insufficient funds to cover amount and fee.")
    } 
    
    
    // 4. write some data to DB (출금 계좌에서 총 출금액 감소)
    Database.updateBalance(SenderID, -TotalWithdrawal)
    // 6. some more DB (입금 계좌에 원금 증가)
    Database.updateBalance(ReceiverID, Amount)
}
{% endcapture %}


{% include code-table.html 
   tabs="Pesudo,Example"
   Pesudo=Pesudo
   Pesudo_language="text"
   Example=Example
   Example_language="text"
%}


Transaction Script는 추상화와 같은 한번에 이해하기 어려운 요소를 최소화하고, 행위의 플로우를 그대로 표현한다.  

## 명확한 장단점
이해하기 아주 쉽다.  
모든 로직들이 도메인 로직에 아주 연관되어있고,
코드를 차례대로 쭉 읽으면 된다.  

대신, (위 예시 보았을 때)
풍부한 도메인 모델도 없고, 특정 로직만을 재사용하기도 어렵다.  
한 procedure에서 데이터베이스 접근 로직도 섞여있어 도메인 로직만을 테스트하기도 어렵다.  
Transaction Script의 명확한 단점 때문에, 대게의 경우 선택 사항에서 제외한다.  

---


# [Reinventing the Transaction Script - Scott Wlaschin](https://www.youtube.com/watch?v=USSkidmaS6w)
Scott Wlaschin의 스피치에서 Funtional Programming(FP)를 활용해 어떻게 Transaction Script의 단점을 극복할 수 있을 지를 제시한다.   

가장 작은 단위 도메인 로직들(workflow)을 stand-alone한 함수로 선언하고,  
레고를 조립하듯이 함수를 조립해 복잡한 로직들을 구성한다.  
함수들이 일종의 전략 패턴처럼 동작하고, 한 procedure에 관련 로직들이 응집되면서 일종의 bounded context를 형성한다.  

## Tic Tac Toe

[Transaction Script를 FP와 OO로 비교해봤다.](https://github.com/minseon9/ts-tic-tac-toe)  
FP는 Haskell로도 구현지만, 비교가 쉽도록 Python으로 한번 더  구현했다.  




{% capture Fo %}  
def process_turn(state: GameState, pos: Position) -> tuple[GameResult | Cell | str, GameState]:
    current_board = state.board
    current_player = state.current_player

    # 1. Validation and state transformation
    new_board_or_error = place_piece(current_board, pos, current_player)

    if isinstance(new_board_or_error, str):
        # Return error message and current state on error
        return (new_board_or_error, state)

    new_board = new_board_or_error

    # 2. Check result
    result = check_game_result(new_board)

    # 3. Create new state (set next player)
    new_state = state._replace(
        board=new_board,
        current_player=next_player(current_player)
    )

    # 4. Return result and new state
    return (result, new_state)
{% endcapture %}

{% capture Oo %}  
def processTurn(game: Game, row: int, col: int) -> str:
    # 1. Validate game state
    if game.is_over:
        return f"Game is already over, winner is {game.winner}."

    # 2. Validate position (Transaction Script performs directly)
    if not (0 <= row < 3 and 0 <= col < 3):
        return "Error: Coordinates must be between 0 and 2."

    if game.board.get_cell(row, col) != ' ':
        return "Error: Cell is already occupied."

    # 3. State change (Transaction/Move execution)
    player = game.current_player
    game.board.set_cell(row, col, player.value)  # Service directly manipulates Board state

    # 4. Check result and update state (post-processing procedure)
    winner = findWinner(game.board)
    if winner:
        game.is_over = True
        game.winner = winner.value
        return f"Player {winner.value} wins!"

    if isFull(game.board):
        game.is_over = True
        game.winner = 'None'  # draw
        return "It's a draw!"

    # 5. Set next turn
    game.current_player = Player.O if player == Player.X else Player.X
    return f"Next turn: {game.current_player.value}"
{% endcapture %}

{% include code-table.html 
   tabs="fo,oo"
   fo=Fo
   fo_language="python"
   oo=Oo
   oo_language="python"
%}


OO로 구현한 경우, **도메인 로직의 주도권은 객체 외부에 존재하고(도메인 로직이 객체에 추상화되지 않고) 외부에서 객체의 상태값 변경**한다.  
각 Object는 단순히 데이터만을 담고 있는 무기력한 모델(Anemic Domain Model)이다.  

FP 구현에서 **각 순수 함수는 외부 상태를 변경하는 것이 아니라, 새로 생성함으로(immutable) 독립적인 로직을 정의**한다.  
process_turn는 각 독립적인 workflow로 전체 workflow를 정의한다.  
사용자 입력값을 받는 IO 또한 edge에 위치하고, 도메인 로직과는 어느 정도 분리된다.  

DDD라는 도메인 설계부터, Domain  Model, Horizantal한 아키텍쳐가 당연한 고려 사항이 되고 있다.  
이미 어느 정도 도메인 설계가 자리잡고, 그 복잡도를 관리해야하는 차원에서는 아주 유효한 선택지이다.  

프로젝트를 처음 시작할 때,
모두가 도메인 전문가가 아닌 입장에서 처음부터 이런 선택지가 유효한 지에 대한 의문이 있다.  
Transaction Script로, 특히 영상에서 제안하는 FP를 활용한 구현을 통해서, 도메인 로직들을 명확하게 이해할 수 있는 환경은 역설적으로 도메인을 정의하는데 더 도움이 될 수 있다.  
함수 인터페이스를 유지하면서, 로직 상에서 확인할 수 있는 context를 도메인 모델로 변환하는 것이 유효한 선택일 수 있겠다.  

---  

# 마무리
복잡한 문제에 단순한 정답은 없다.
명확한 근거 위에서 어떻게 구현할 것인가를 선택하는 것 자체가 아키텍쳐이고, 
동시에 변화에 대비할 수 있음이 우리가 해야할 일이다.  

Transaction Script는 안티패턴이야 가 아니라 충분히 선택할 수 있는 선택지이다.  
우리가 해야할 것은 FP와 같은 방식으로, 선택을 변경해야하는 경우를 대응하는 것이 아닐까.

