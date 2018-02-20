### GeoloctionExtensionKit
NCP Geolocation Extension Kit : Geolocation + NAVER Maps v3 + NAVER Search

#### Encoding QueryString 
const qs = require('querystring');

#### app.get('/geolocationMap', function (req, res) {})
Geolocation 실행 후 수집된 좌표 정보를 통해 지도를 그리고 마크를 합니다.

#### app.get('/geolocationPano', function (req, res) {})
Geolocation 실행 후 수집된 좌표 정보를 통해 파노라마를 실행하고 마크를 합니다.

#### app.get('/geolocationExtInfo/:query', function (req, res) {})
Geolocation 실행 후 수집된 좌표 정보를 통해 네이버 검색의 지역정보와 융합하여 
맛집,주유소 등 여러가지 정보를 추가로 제공할 수 있습니다.

