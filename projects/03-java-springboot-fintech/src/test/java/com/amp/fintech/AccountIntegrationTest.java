package com.amp.fintech;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class AccountIntegrationTest {

  @Autowired
  JdbcTemplate jdbc;

  @Test
  void accountsList() {
    jdbc.execute("INSERT INTO accounts(id, customer_id, balance_cents, status) VALUES(500,1000,100000,'ACTIVE') ON CONFLICT DO NOTHING");
    List<Map<String,Object>> rows = jdbc.queryForList("SELECT * FROM accounts");
    assertTrue(rows.size() >= 1);
  }
}
