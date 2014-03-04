$LOAD_PATH << '../support'
require 'caddis'
require 'net/http'
require 'json'
require 'uri'

Given(/^I have started caddis$/) do
  # should have started using @caddis tag and my-hooks loaded.
  @response_data = nil # to be filled in upon request response
end

Given(/^I POST to caddis to add a route with:$/) do |jsonString|
  postBody = JSON.parse(jsonString)
  Caddis.add_route(postBody["method"], postBody["uri"], postBody["response"], postBody["status"], postBody["delay"])
end

When(/^I do a GET request on \/user\/(\d+)$/) do |user_id|
  response = Net::HTTP.get_response(URI.parse("http://localhost:3001/user/" + user_id))
  @response_data = response.body.strip
end

Then(/^I am returned the response:$/) do |expectedResponse|
  expect(@response_data).to eq(expectedResponse)
end