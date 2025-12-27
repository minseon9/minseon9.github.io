---
layout		: single
title		: 
summary	: 
date		: 2025-12-26 14:26:57 +0900
updated	: 2025-12-26 16:23:45 +0900
category	: 
tags		: 
toc		: true
public		: true
parent		: 
latex		: false
resource	: 59AB2E0E-6F50-427A-8387-A7B5E8EA328E
author_profile :  false
classes	:  wide
---


- Active Record creates a "thin layer" of "strong binding" between the database and the application code.
Through 'Model', application code can access database, and this mean application code have to know database access logic.

- Managing database accesss is distributed, a lot of N+1 accoure,

- Active Record make strong binding between domain logic and database access(infra), so make complicater to test domain logic
Why AR make mocking harder. What is mock.


Active Record 패턴의 주요 테스트 복잡성:

Relation 조회 - 가장 큰 문제
# 실제 코드
class OrderService:
    def get_order_summary(self, order_id):
        order = Order.objects.get(id=order_id)
        # 이 한 줄에서 여러 쿼리 발생 가능
        items = order.items.all()
        customer = order.customer
        shipping = order.shipping_address
        
        return {
            'total': sum(item.price for item in items),
            'customer_name': customer.name,
            'address': shipping.full_address
        }

# 테스트 시 모킹해야 할 것들
def test_get_order_summary():
    mock_order = Mock()
    mock_order.items.all.return_value = [Mock(price=100), Mock(price=200)]
    mock_order.customer = Mock(name='John')
    mock_order.shipping_address = Mock(full_address='123 Street')
    
    # QuerySet도 모킹
    with patch.object(Order.objects, 'get', return_value=mock_order):
        # ... 복잡해짐

QuerySet 체이닝 - 모킹이 복잡함
# 실제 코드
def get_active_orders(self, customer_id):
    return Order.objects.filter(
        customer_id=customer_id
    ).exclude(
        status='cancelled'
    ).select_related(
        'customer'
    ).prefetch_related(
        'items'
    ).order_by('-created_at')[:10]

# 테스트 - 각 메서드 체이닝을 모두 모킹해야 함
def test_get_active_orders():
    mock_qs = Mock()
    mock_qs.filter.return_value = mock_qs
    mock_qs.exclude.return_value = mock_qs
    mock_qs.select_related.return_value = mock_qs
    mock_qs.prefetch_related.return_value = mock_qs
    mock_qs.order_by.return_value = [mock_order1, mock_order2]
    
    # 너무 복잡...



Manager/Custom QuerySet - 추가 모킹 대상
숨겨진 쿼리 (property, lazy loading)
Signal과 side effect
데이터와 로직의 결합
class Order(models.Model):
    # Active Record는 데이터 + 로직이 결합
    def can_cancel(self):
        return self.status == 'pending' and self.created_at > timezone.now() - timedelta(hours=24)
    
    def apply_discount(self, code):
        discount = Discount.objects.get(code=code)  # 또 다른 DB 조회!
        self.discount_amount = discount.calculate(self.total)
        self.save()

# 테스트 시 내부 DB 조회까지 모킹 필요



-----

At the end, trying to seperate these two layer and Data Mapper로 귀결

A. Repository 패턴 도입 (권장)
2. Fake Model 만들기 https://github.com/django/django/blob/stable/6.0.x/django/db/models/base.py#L501
