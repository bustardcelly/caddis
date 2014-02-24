Feature: Add of PUT request
  As a User of Caddis
  I want to add a PUT request with return data
  So I can mock a service call

  Background: Caddis Started
    Given The Caddis server has started

  Scenario: GET request exposed at uri
    When I submit a "PUT" request with response JSON:
    """
    {  
      "method": "put",
      "uri": "/user/:id",
      "response": {
        "id": "foo",
        "name": "bar",
        "info": "baz"
      }
    }
    """
    Then The JSON is returned by issuing a "PUT" at the specified uri:
    """
    {
      "id": "foo",
      "name": "bar",
      "info": "baz"
    }
    """