Feature: Example of using Caddis
  As a Developer of an iOS application
  I want to user Caddis
  So I can mock service requests for testing

  @caddis
  Scenario: Example of using caddis to add GET route
    Given I have started caddis
    And I POST to caddis to add a route with:
    """
    {
      "method": "GET",
      "uri": "/user/:id",
      "response": {
        "foo": "bar"
      }
    }
    """
    When I do a GET request on /user/1234
    Then I am returned the response:
    """
    {"foo":"bar"}
    """