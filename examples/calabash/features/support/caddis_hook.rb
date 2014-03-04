$LOAD_PATH << './features/support'
require 'caddis'

Before('@caddis') do |scenario|
  Caddis.start()
end

After('@caddis') do |scenario|
  Caddis.stop()
end