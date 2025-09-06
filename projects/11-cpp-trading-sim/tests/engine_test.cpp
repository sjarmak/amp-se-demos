#include <gtest/gtest.h>
#include "engine.hpp"

class EngineTest : public ::testing::Test {
protected:
    TradingEngine engine;
};

TEST_F(EngineTest, AddOrderCreatesBook) {
    engine.addOrder("AAPL", Side::BUY, 100, 15000);
    const auto& book = engine.getBook("AAPL");
    EXPECT_EQ(book.getBids().size(), 1);
    EXPECT_EQ(book.getBids()[0].price, 15000);
    EXPECT_EQ(book.getBids()[0].quantity, 100);
}

TEST_F(EngineTest, EmptyBookReturnsEmpty) {
    const auto& book = engine.getBook("NONEXISTENT");
    EXPECT_TRUE(book.getBids().empty());
    EXPECT_TRUE(book.getAsks().empty());
}
