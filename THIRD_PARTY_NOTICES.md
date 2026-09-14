# THIRD-PARTY SOFTWARE, DATA, SERVICE, AND TRADEMARK NOTICES

This document provides notices for third-party software, data, hosted services,
and trademarks used by or referenced by `where_should_we_meet`.

The MIT License in the root of this repository applies to the original source
code of `where_should_we_meet` for which the project author holds the
applicable copyright.

Third-party software, data, hosted services, trademarks, and other
third-party intellectual property remain subject to their own licenses,
terms, policies, and rights.

---

## 1. Leaflet

**Component:** Leaflet
**Version currently used:** 1.9.4
**License:** BSD 2-Clause License
**License text:** [`LICENSES/BSD-2-Clause.txt`](LICENSES/BSD-2-Clause.txt)

`where_should_we_meet` uses Leaflet to display and interact with maps in the
web browser.

The current application loads Leaflet JavaScript and CSS through the
UNPKG content delivery network.

Leaflet is licensed separately from this project.

The MIT License of `where_should_we_meet` does not replace or modify the
BSD 2-Clause License applicable to Leaflet.

Leaflet attribution and applicable copyright notices should be preserved as
required by its license.

---

## 2. Firebase JavaScript SDK

**Component:** Firebase JavaScript SDK
**Version currently used:** 12.7.0
**Modules currently used:**

* Firebase App
* Firebase Authentication
* Firebase Realtime Database

**Primary license:** Apache License 2.0
**License text:** [`LICENSES/Apache-2.0.txt`](LICENSES/Apache-2.0.txt)

`where_should_we_meet` uses the Firebase JavaScript SDK for Google account
authentication and synchronization of shared room data through Firebase
Realtime Database.

The current application loads Firebase modules dynamically from Google's
hosted Firebase JavaScript distribution.

The Firebase JavaScript SDK is developed separately from this project and
is not licensed under the MIT License of `where_should_we_meet`.

The upstream Firebase JavaScript SDK distribution may contain components or
third-party material that are subject to additional licenses. If Firebase
SDK files are copied, bundled, vendored, modified, or redistributed directly
with this project in the future, the applicable upstream license files and
third-party notices should also be reviewed and preserved.

Use of Firebase Authentication, Firebase Realtime Database, Google Sign-In,
and other Google-hosted services is additionally subject to Google's
applicable service terms, policies, and conditions.

---

## 3. OpenStreetMap Data

**Data source:** OpenStreetMap
**License:** Open Data Commons Open Database License 1.0 (ODbL 1.0)
**License text:** [`LICENSES/ODbL-1.0.txt`](LICENSES/ODbL-1.0.txt)

Map data used by the application is provided by OpenStreetMap contributors.

OpenStreetMap data is licensed separately from the original source code of
`where_should_we_meet`.

The MIT License of this project does not apply to OpenStreetMap data.

The application should display appropriate attribution to OpenStreetMap
contributors when OpenStreetMap data is shown.

The map currently uses attribution equivalent to:

`© OpenStreetMap contributors`

with a link to OpenStreetMap's copyright and licensing information.

---

## 4. OpenStreetMap Standard Tile Service

**Service:** OpenStreetMap Standard Tile Service
**Host currently used:** `tile.openstreetmap.org`

The application currently obtains raster map tiles from the public
OpenStreetMap tile service.

Access to this hosted service is separate from the ODbL license that applies
to OpenStreetMap data.

Use of the public OpenStreetMap tile servers is subject to the OpenStreetMap
Foundation's Tile Usage Policy and other applicable OSMF terms and policies.

Among other requirements, applications using the standard public tile
service must:

* use the supported tile URL;
* display visible OpenStreetMap attribution;
* allow normal browser identification and HTTP Referer information;
* respect HTTP caching behavior; and
* avoid bulk downloading, scraping, prefetching, or other excessive use.

The public OpenStreetMap tile service is community-funded and is provided on
a best-effort basis. Availability is not guaranteed.

Applications with significant traffic should evaluate whether another tile
provider or a self-hosted solution is more appropriate.

---

## 5. Nominatim

**Service:** OpenStreetMap Nominatim public geocoding service
**Host currently used:** `nominatim.openstreetmap.org`

`where_should_we_meet` uses the public Nominatim service for:

* searching for addresses and place names; and
* reverse geocoding selected map coordinates into human-readable locations.

The hosted Nominatim service is not distributed as part of this project.

Use of the public Nominatim server is subject to the OpenStreetMap
Foundation's Nominatim Usage Policy and other applicable OSMF terms and
policies.

The public service has limited capacity. Applications must avoid heavy use
and must respect the applicable request-rate restrictions.

The current client includes a shared rate limiter for its address-search and
reverse-geocoding requests. This client-side rate limiting reduces requests
from an individual browser session, but it does not guarantee that aggregate
traffic from all users of a publicly deployed application will remain below
service-wide limits.

If usage increases, the project operator should consider caching,
server-side coordination, another geocoding provider, or a separately hosted
Nominatim-compatible service as appropriate.

---

## 6. External Services and User Data

Some features of `where_should_we_meet` transmit information to third-party
services.

### Firebase and Google Authentication

When a user signs in with Google, account information made available through
Firebase Authentication may be processed by Google and Firebase services.

The application may store information in Firebase Realtime Database,
including data such as:

* the user's display name;
* email address;
* profile photo URL;
* account-to-participant association;
* shared participant names;
* selected meeting locations;
* location labels;
* user-entered memos; and
* synchronization timestamps.

The exact information stored may change as the application is updated.

### Nominatim

When address search is used, the entered search term is transmitted to the
public Nominatim service.

When a map location is selected and reverse geocoding is performed, the
selected latitude and longitude are transmitted to the public Nominatim
service.

Users should avoid submitting confidential or sensitive information through
public third-party services unless they understand and accept the applicable
service policies.

### OpenStreetMap Tile Service

Displaying the map causes the user's browser to request map tiles from the
OpenStreetMap tile service.

Normal web request information may therefore be processed by that external
service according to the OpenStreetMap Foundation's applicable policies.

---

## 7. CDN-Hosted Third-Party Resources

The current application loads some third-party software from external
content delivery networks instead of storing copies directly in this
repository.

These include:

* Leaflet resources loaded through UNPKG; and
* Firebase JavaScript SDK modules loaded from Google's hosted Firebase
  distribution.

Availability, security, privacy practices, and terms applicable to those
hosting services are separate from the MIT License of this project.

If these dependencies are later stored or bundled directly in this
repository, their original copyright notices, license texts, and other
required notices should be preserved.

---

## 8. Google and Firebase Trademarks

Google, Firebase, Google Sign-In, and related names and marks are trademarks
or other intellectual property of Google LLC and/or their respective rights
holders.

Their use in this project is solely for identification, compatibility, and
interoperability purposes.

`where_should_we_meet` is not affiliated with, sponsored by, approved by, or
endorsed by Google LLC.

No Google or Firebase service is licensed under the MIT License of this
project.

---

## 9. OpenStreetMap Trademarks and Attribution

OpenStreetMap and related names and marks belong to their respective rights
holders.

References to OpenStreetMap, Nominatim, and related services are used solely
to identify the mapping data and services used by the application.

Nothing in the MIT License of `where_should_we_meet` grants rights to
OpenStreetMap trademarks, map data, hosted services, or other third-party
intellectual property.

---

## Project License

Except for separately licensed third-party software, data, services, and
other third-party intellectual property described above, the original source
code of `where_should_we_meet` is distributed under the MIT License.

See the root [`LICENSE`](LICENSE) file for the full project license terms.

For third-party license information, see the
[`LICENSES/`](LICENSES/) directory.
