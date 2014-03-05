Feature: Access request traffic on caddis
  As a developer using caddis
  I want to access the request traffic
  So that I can assert expectations of request structure

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: Access list of request from single POST
    When I submit a "GET" request with response JSON:
    """
    {
      "method": "get",
      "uri": "/user/:id",
      "response": {
        "name": "foo"
      }
    }
    """
    When I make a GET request to caddis at "http://localhost:3001/user/22334"
    And I access the calls list at "http://localhost:3001/_call_requests"
    Then I am returned:
    """
    [
      {
        "request": {
          "method": "GET",
          "url": "/user/22334",
          "statusCode": 200,
          "body": null
        },
        "response": {
          "name": "foo"
        }
      }
    ]
    """