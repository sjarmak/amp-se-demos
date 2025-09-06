#pragma once
#include <vector>

struct Order {
    int price;
    int quantity;
    
    Order(int p, int q) : price(p), quantity(q) {}
};

class OrderBook {
private:
    std::vector<Order> bids_;
    std::vector<Order> asks_;
    
public:
    void addBid(int price, int quantity);
    void addAsk(int price, int quantity);
    const std::vector<Order>& getBids() const { return bids_; }
    const std::vector<Order>& getAsks() const { return asks_; }
    void clear();
};
