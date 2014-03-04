require 'net/http'
require 'uri'

module Caddis

  def Caddis.start()
    started = system('caddis start')
    if started
      sleep(STEP_PAUSE)
    end
  end

  def Caddis.add_route(method, uri, response, status_code=nil, delay=0)
    post_body = {:method => method, :uri => uri, :response => response, :delay => delay.to_i}
    if status_code.is_a? Integer
      post_body[:status] = status_code
    end
    uri = URI('http://localhost:3001/api')
    req = Net::HTTP::Post.new uri.path
    req.body = JSON.dump(post_body)
    res = Net::HTTP.start(uri.host, uri.port) do |http|
      http.request req
    end
  end

  def Caddis.stop()
    system('caddis stop')
  end

end