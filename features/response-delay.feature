Feature: Delay Response
  As a User of Caddis
  I want to delay the response of a REST request
  So I can properly test state between submit and response

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: Request with Response Status Code
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user/:id",
      "response": {
        "name": "foo"
      },
      "delay": 1000
    }
    """
    Then The response is received after 1000 milliseconds:
    """
    {
      "name": "foo"
    }
    """