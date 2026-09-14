# where_should_we_meet [odi-myeo]

친구들끼리 모임장소 정하려고 만든 프로젝트 입니다.
<br>
<br>
크게 자신이 사이트의 주소를 배포하는 경우와 친구로부터 주소를 받아서 모임장소를 정하는 경우로 나뉩니다.
</br>
<br>
</br>
<br>
### 1. 자신이 주소를 배포하는 경우 
&nbsp;&nbsp;&nbsp;&nbsp;[이 링크](https://odi-myeo.netlify.app/) 를 통하여 접속하여 주십시오.

&nbsp;&nbsp;&nbsp;&nbsp;1)   사이트에 접속하시면  먼저 하단에 위치한 ```google 로그인```을 하셔야 합니다.
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://github.com/peropero1111/where_should_we_meet/blob/main/img/2026-07-30%20170519.png" width="550" height="550"/> 
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;2)  google 계정으로 로그인 하신 다음에는 상단의 ```참여자 명단 설정```에서 인원수와 친구들의 이름을 적어주신후 명단 저장을 눌러 주십시오.
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://github.com/peropero1111/where_should_we_meet/blob/main/img/2026-07-30%20171132.png?raw=true" width="650" height="650"/> 
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;3)  상단에 위치한 ```공유링크```를 공유하여 주시면 됩니다.
<br>
<br>
<br>
<br>

### 2. 공유된 주소로 접속하는 경우 

&nbsp;&nbsp;&nbsp;&nbsp;1)  이 경우도 사이트에 접속하시면  먼저 하단에 위치한 ```google 로그인```을 하셔야 합니다.
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;2)  계정로그인이 성공하면 자동으로 사이트를 공유한 친구와 같은 사이트를 보게 됩니다.
<br>
<br>
<br>
<br>

### 3. 기타 기능 소개
&nbsp;&nbsp;&nbsp;&nbsp;1)  자신이 고른 이름 을 클릭한 후 간단한 메모를 남길 수 있습니다.
<br>
<br>
&nbsp;&nbsp;&nbsp;<img src="https://github.com/peropero1111/where_should_we_meet/blob/main/img/2026-07-30%20173222.png?raw=true" width="350" height="350"/> 
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;2)  ```주소 또는 장소명 입력```이라고 쓰여있는 부분에 정확한 도로명 주소를 (--시,  --대로, --- ) 넣으면 (2026 07월 기준) 찾아줍니다. 
<br>
<br>
&nbsp;&nbsp;&nbsp;<img src="https://github.com/peropero1111/where_should_we_meet/blob/main/img/2026-07-30%20173340.png?raw=true" width="350" height="350"/> 

---

## 라이선스 및 제3자 구성요소

`where_should_we_meet`에서 프로젝트 작성자가 직접 작성하고 저작권을
보유한 원본 소스 코드는 MIT License에 따라 배포됩니다.

자세한 내용은 저장소 루트의 [`LICENSE`](LICENSE) 파일을 참고해
주십시오.

이 프로젝트는 다음과 같은 제3자 소프트웨어, 데이터 및 외부 서비스를
사용합니다.

| 구성요소                                | 용도                       | 라이선스 또는 정책             |
| ----------------------------------- | ------------------------ | ---------------------- |
| Leaflet 1.9.4                       | 웹 지도 표시 및 조작             | BSD 2-Clause License   |
| Firebase JavaScript SDK             | Google 로그인 및 실시간 데이터 동기화 |  Apache License 2.0  |
| OpenStreetMap 데이터                   | 지도 데이터                   | ODbL 1.0               |
| OpenStreetMap Standard Tile Service | 지도 타일 제공                 | OSM Tile Usage Policy  |
| Nominatim                           | 주소 검색 및 역지오코딩            | Nominatim Usage Policy |

각 제3자 구성요소에는 `where_should_we_meet`의 MIT License와 별개의
라이선스, 이용약관 또는 서비스 정책이 적용됩니다.

자세한 내용은 다음 파일을 참고해 주십시오.

* [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)
* [`LICENSES/README.md`](LICENSES/README.md)
* [`LICENSES/`](LICENSES/)

`LICENSES/` 폴더에는 다음과 같은 라이선스 전문을 둘 수 있습니다.

* `Apache-2.0.txt` — Firebase JavaScript SDK의 주요 라이선스
* `BSD-2-Clause.txt` — Leaflet
* `ODbL-1.0.txt` — OpenStreetMap 데이터

위 라이선스는 각각의 제3자 구성요소에 적용되며,
`where_should_we_meet`의 원본 코드에 적용되는 MIT License를
대체하지 않습니다.

---

## OpenStreetMap 지도 및 타일 서비스 안내

이 프로젝트는 OpenStreetMap 데이터를 사용하며 지도에
OpenStreetMap 기여자 attribution을 표시합니다.

OpenStreetMap 데이터는 ODbL 1.0에 따라 제공됩니다.

또한 이 프로젝트는 현재 OpenStreetMap Foundation이 운영하는
공개 표준 타일 서버를 사용합니다.

공개 타일 서버는 OpenStreetMap 데이터 자체와는 별도의 서비스이며
OpenStreetMap Foundation의 Tile Usage Policy가 적용됩니다.

이 서비스는 커뮤니티 자원으로 운영되며 안정성이나 지속적인
가용성이 보장되는 상용 서비스가 아닙니다.

과도한 요청, 대량 다운로드, 지도 타일의 사전 다운로드 등 서비스
정책에 위배되는 방식으로 사용해서는 안 됩니다.


---




## 외부 서비스 및 데이터 처리 안내

`where_should_we_meet`의 일부 기능은 외부 서비스를 사용하므로
프로그램 사용 과정에서 일부 정보가 외부 서버로 전송되거나 저장될 수
있습니다.

### Google 로그인 및 Firebase

이 프로젝트는 Google 계정 로그인과 공유 기능을 위해 Firebase
Authentication 및 Firebase Realtime Database를 사용합니다.

Google 계정으로 로그인하면 Firebase를 통해 다음과 같은 계정 정보가
처리되거나 저장될 수 있습니다.

* 표시 이름
* 이메일 주소
* 프로필 사진 URL
* 계정 식별 정보
* 참여자와 계정의 연결 정보
* 로그인 및 동기화 관련 시간 정보

또한 공유 방 기능을 사용하면 다음과 같은 정보가 Firebase Realtime
Database에 저장될 수 있습니다.

* 참여자 이름
* 선택한 위치 및 좌표
* 위치의 주소 또는 표시 이름
* 사용자가 작성한 메모
* 참여자와 Google 계정의 연결 정보
* 데이터 갱신 시간

따라서 공개해서는 안 되는 개인 정보나 민감한 정보를 참여자 이름 또는
메모 등에 입력하지 않는 것을 권장합니다.

### Nominatim

주소 검색 기능을 사용하면 사용자가 입력한 주소 또는 장소명이
Nominatim 공개 서버로 전송됩니다.

지도에서 위치를 선택해 주소를 확인하는 경우 선택한 위도와 경도가
Nominatim 공개 서버로 전송될 수 있습니다.

공개 지오코딩 서비스에 기밀 정보 또는 불필요하게 민감한 위치 정보를
전송하지 않는 것을 권장합니다.

### 지도 타일

지도를 표시하면 사용자의 웹 브라우저가 OpenStreetMap 타일 서버에
필요한 지도 타일을 요청합니다.

이 과정에는 일반적인 웹 요청에 포함되는 네트워크 정보가 외부 서비스에
전달될 수 있으며 해당 서비스의 개인정보 및 이용 정책이 적용됩니다.

---

## 외부 CDN 안내

현재 이 프로젝트는 일부 제3자 라이브러리를 저장소에 직접 포함하지 않고
외부 CDN을 통해 불러옵니다.

현재 사용되는 외부 리소스에는 다음이 포함됩니다.

* UNPKG를 통해 불러오는 Leaflet
* Google이 제공하는 Firebase JavaScript SDK 모듈

따라서 이러한 외부 서비스가 사용할 수 없는 경우 관련 기능이 정상적으로
작동하지 않을 수 있습니다.

또한 외부 CDN 서비스에는 각각의 이용약관 및 개인정보 관련 정책이
적용될 수 있습니다.

향후 해당 라이브러리를 저장소에 직접 포함하거나 번들링할 경우에는
해당 버전의 원본 라이선스와 제3자 고지를 다시 확인해야 합니다.

---

## 비공식 프로젝트 및 상표 안내

`where_should_we_meet`는 비공식 서드파티 오픈소스 프로젝트입니다.

이 프로젝트는 다음 단체 또는 회사와 제휴 관계에 있지 않으며 공식적인
승인, 후원 또는 보증을 받은 프로젝트가 아닙니다.

* Google LLC
* OpenStreetMap Foundation

Google, Firebase 및 관련 명칭과 상표는 Google LLC 및/또는 각각의
권리자에게 귀속됩니다.

OpenStreetMap 및 관련 명칭과 상표는 각각의 권리자에게 귀속됩니다.

이 프로젝트에서 이러한 명칭을 사용하는 것은 사용되는 외부 서비스,
호환성 및 데이터 출처를 설명하기 위한 식별 목적으로만 사용됩니다.

---

## 면책조항

이 소프트웨어는 어떠한 종류의 명시적 또는 묵시적 보증 없이
**"있는 그대로(AS IS)"** 제공됩니다.

프로젝트 작성자는 다음 사항을 보장하지 않습니다.

* 지도 데이터가 항상 완전하거나 정확한 것
* 주소 검색 결과가 항상 정확한 것
* 역지오코딩 결과가 실제 주소와 항상 일치하는 것
* OpenStreetMap 타일 서비스가 항상 사용 가능한 것
* Nominatim 서비스가 항상 사용 가능한 것
* Firebase 서비스가 항상 정상적으로 작동하는 것
* 공유된 위치나 메모가 항상 즉시 동기화되는 것

모임 장소나 중요한 위치 정보를 결정할 때에는 필요한 경우 실제 주소 및
다른 지도 자료를 함께 확인하는 것을 권장합니다.

이 프로젝트의 사용으로 발생하는 결과에 대한 책임은 저장소의
`LICENSE`에 규정된 범위 내에서 제한됩니다.

