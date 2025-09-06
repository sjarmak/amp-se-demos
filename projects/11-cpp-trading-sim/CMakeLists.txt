cmake_minimum_required(VERSION 3.20)
project(TradingSim)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find GTest
find_package(GTest REQUIRED)
find_package(Threads REQUIRED)

# Main executable
add_executable(trading_sim
    src/main.cpp
    src/engine.cpp
    src/order_book.cpp
)

target_include_directories(trading_sim PRIVATE src)
target_compile_options(trading_sim PRIVATE -O3 -march=native)

# Tests
add_executable(trading_tests
    tests/engine_test.cpp
    tests/order_book_test.cpp
    src/engine.cpp
    src/order_book.cpp
)

target_include_directories(trading_tests PRIVATE src)
target_link_libraries(trading_tests GTest::GTest GTest::Main Threads::Threads)

enable_testing()
add_test(NAME TradingTests COMMAND trading_tests)
