# Third-Party Licenses

This directory contains license texts associated with third-party software
and data used by `where_should_we_meet`.

These license files do **not** replace or modify the MIT License in the root
of this repository.

The root `LICENSE` file applies to the original source code of
`where_should_we_meet` for which the project author holds the applicable
copyright.

Third-party software and data remain subject to their own licenses,
copyright notices, attribution requirements, service terms, and other
conditions.

For package-specific notices, hosted-service information, and trademark
notices, see:

[`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)

---

## License Files

| License file                           | License                   | Component or data                                  |
| -------------------------------------- | ------------------------- | -------------------------------------------------- |
| [`Apache-2.0.txt`](Apache-2.0.txt)     | Apache License 2.0        | Firebase JavaScript SDK (primary upstream license) |
| [`BSD-2-Clause.txt`](BSD-2-Clause.txt) | BSD 2-Clause License      | Leaflet                                            |


---

## Leaflet

`where_should_we_meet` currently uses Leaflet 1.9.4 for interactive map
display and interaction.

Leaflet is distributed under the BSD 2-Clause License.

The applicable license text should be stored as:

[`BSD-2-Clause.txt`](BSD-2-Clause.txt)

The Leaflet license applies to Leaflet itself and does not apply to the
original source code of `where_should_we_meet`.

The current application loads Leaflet from an external CDN rather than
storing a copy of the Leaflet distribution in this repository.

If Leaflet is later bundled directly with this project, its upstream
copyright notice and BSD 2-Clause License must be preserved as required by
that license.

---

## Firebase JavaScript SDK

`where_should_we_meet` currently uses Firebase JavaScript SDK modules for:

* Firebase application initialization;
* Firebase Authentication; and
* Firebase Realtime Database.

The primary license of the Firebase JavaScript SDK is the Apache License 2.0.

A reference copy of that license should be stored as:

[`Apache-2.0.txt`](Apache-2.0.txt)

The current application loads Firebase modules from Google's hosted Firebase
JavaScript distribution rather than storing those SDK files directly in this
repository.

The upstream Firebase JavaScript SDK repository also contains some
separately licensed third-party material.

Therefore, if Firebase SDK files are later copied, bundled, vendored,
modified, or redistributed directly with `where_should_we_meet`, the exact
Firebase version and its upstream `LICENSE`, third-party notices, and bundled
dependencies should be reviewed at that time.

The Apache License 2.0 file in this directory should not be interpreted as
relicensing every possible component of an upstream Firebase distribution.

---

## OpenStreetMap Data

`where_should_we_meet` displays map information based on OpenStreetMap data.

OpenStreetMap data is made available under the Open Data Commons Open
Database License version 1.0 (ODbL 1.0).

This repository does not currently distribute a copy of the OpenStreetMap
database or a Derivative Database. Therefore, the full ODbL license text is
not included in this `LICENSES` directory.

The application provides attribution to OpenStreetMap contributors and links
to OpenStreetMap's copyright and licensing information.

For the applicable OpenStreetMap data license and attribution information,
see:

https://www.openstreetmap.org/copyright

If a future version of this project directly distributes OpenStreetMap data
or a Derivative Database, the applicable ODbL requirements should be reviewed
again and a copy of the license or an appropriate direct license reference
should be included as required.


---

## Hosted Services Are Different From Distributed Software

Some third-party resources used by `where_should_we_meet` are accessed as
hosted network services rather than copied into this repository.

These currently include:

* the OpenStreetMap Standard Tile Service;
* the public OpenStreetMap Nominatim service;
* Firebase Authentication;
* Firebase Realtime Database;
* Google's hosted Firebase JavaScript modules; and
* UNPKG, from which Leaflet is currently loaded.

The terms and usage policies for hosted services are not replaced by the
software and data license files in this directory.

For example:

* the OpenStreetMap Standard Tile Service is subject to the OSMF Tile Usage
  Policy;
* the public Nominatim service is subject to the OSMF Nominatim Usage
  Policy; and
* Firebase and Google services are subject to Google's applicable service
  terms and policies.

See [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) for more
information.

---

## Source Distribution

The source repository currently references Leaflet and Firebase through
external hosted resources.

Because those third-party distributions are not necessarily copied into the
repository itself, the exact redistribution obligations may differ from a
project that vendors or bundles those dependencies.

Nevertheless, this directory provides local copies of the primary license
texts for clarity and attribution.

---

## Future Bundled or Self-Hosted Distributions

If future releases copy or bundle third-party libraries, map data, map tiles,
or other external resources directly into the repository or another
distribution, the applicable licenses should be reviewed again.

In particular, the distributor should verify:

* the exact dependency version;
* all upstream copyright notices;
* all upstream `LICENSE` and `NOTICE` files;
* separately licensed bundled dependencies;
* attribution requirements;
* data-license requirements; and
* redistribution requirements.

Additional license files may need to be added to this directory in future
releases.

---

## Service Policies

The following are service policies rather than software licenses, so their
full text does not need to be stored in this directory merely because the
application accesses those public services:

* OpenStreetMap Tile Usage Policy;
* Nominatim Usage Policy; and
* other applicable OpenStreetMap Foundation service policies.

The application operator remains responsible for complying with those
policies while using the services.

---

## Project License

Except for separately licensed third-party software, data, services, and
other third-party intellectual property, the original source code of
`where_should_we_meet` remains licensed under the MIT License.

See:

* [`../LICENSE`](../LICENSE) — MIT License for the original project code.
* [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) — third-party
  software, data, service, attribution, privacy, and trademark notices.
