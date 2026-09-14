
    const roomDatabaseBasePath = "regionSelector/rooms";
    const roomQueryKey = "room";
    const localRoomStorageKey = "whereShouldWeMeetRoomId";
    const localParticipantStorageKey = "whereShouldWeMeetParticipants";
    const maxParticipants = 10;
    const defaultParticipantCount = 5;
    const memoMaxLength = 10;
    const southKoreaBounds = [[32.8, 124.3], [38.75, 132.25]];
    const southKoreaFitBounds = [[33.0, 124.6], [38.55, 131.9]];
    const participantColors = [
    "#1d8a72",
    "#4767a8",
    "#c17a1f",
    "#7b55a3",
    "#cf4f78",
    "#8f342a",
    "#d14f45",
    "#52796f",
    "#8a6f2a",
    "#2f6f8f"
    ];

    let characters = [];

    const characterList = document.querySelector("#characterList");
    const locationList = document.querySelector("#locationList");
    const setupPanel = document.querySelector("#setupPanel");
    const authPanel = document.querySelector("#authPanel");
    const appShell = document.querySelector("#appShell");
    const participantSetupForm = document.querySelector("#participantSetupForm");
    const participantCountInput = document.querySelector("#participantCountInput");
    const participantNameFields = document.querySelector("#participantNameFields");
    const saveParticipantSetupButton = document.querySelector("#saveParticipantSetupButton");
    const syncStatus = document.querySelector("#syncStatus");
    const syncStatusText = document.querySelector("#syncStatusText");
    const signInButton = document.querySelector("#signInButton");
    const signOutButton = document.querySelector("#signOutButton");
    const accountName = document.querySelector("#accountName");
    const accountEmail = document.querySelector("#accountEmail");
    const characterSelect = document.querySelector("#characterSelect");
    const memberCount = document.querySelector("#memberCount");
    const shareLinkInput = document.querySelector("#shareLinkInput");
    const copyShareLinkButton = document.querySelector("#copyShareLinkButton");
    const resetMapButton = document.querySelector("#resetMapButton");
    const addressSearchForm = document.querySelector("#addressSearchForm");
    const addressSearchInput = document.querySelector("#addressSearchInput");
    const addressSearchButton = document.querySelector("#addressSearchButton");
    const searchResults = document.querySelector("#searchResults");

    let locationsRef = null;
    let memosRef = null;
    let usersRef = null;
    let participantsRef = null;
    let firebaseReady = false;
    let databaseApi = null;
    let authApi = null;
    let auth = null;
    let firebaseDatabase = null;
    let currentUser = null;
    let currentRoomId = "";
    let workspaceUnsubscribers = [];
    let users = {};
    let participantsConfigured = false;
    let savedLocations = {};
    let savedMemos = {};
    let editingMemoPersonId = null;
    let map = null;
    let markerLayer = null;
    let addressSearchResults = [];
    let lastAddressSearchAt = 0;

    function setSyncStatus(type, message) {
    syncStatus.className = `sync-status ${type}`;
    syncStatusText.textContent = message;
}

    function getFirebaseConfig() {
    return window.firebaseConfig || {};
}

    function isFirebaseConfigured() {
    const config = getFirebaseConfig();

    return Boolean(
    config.apiKey &&
    config.authDomain &&
    config.databaseURL &&
    config.projectId &&
    config.appId
    );
}

    function sanitizeRoomId(value) {
    const roomId = String(value || "").trim();
    return /^[A-Za-z0-9_-]{8,64}$/.test(roomId) ? roomId : "";
}

    function createRoomId() {
    if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

    const randomPart = Math.random().toString(36).slice(2, 14);
    return `${Date.now().toString(36)}${randomPart}`;
}

    function getRoomIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return sanitizeRoomId(params.get(roomQueryKey));
}

    function getSavedRoomId() {
    try {
    return sanitizeRoomId(localStorage.getItem(localRoomStorageKey));
} catch (error) {
    return "";
}
}

    function saveRoomId(roomId) {
    try {
    localStorage.setItem(localRoomStorageKey, roomId);
} catch (error) {
    console.warn("Room id save failed:", error);
}
}

    function ensureRoomId() {
    const roomId = getRoomIdFromUrl() || getSavedRoomId() || createRoomId();
    const url = new URL(window.location.href);

    currentRoomId = roomId;
    saveRoomId(roomId);

    if (url.searchParams.get(roomQueryKey) !== roomId) {
    url.searchParams.set(roomQueryKey, roomId);
    window.history.replaceState(null, "", url.toString());
}

    return roomId;
}

    function getShareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set(roomQueryKey, currentRoomId || ensureRoomId());
    return url.toString();
}

    function getRoomDatabasePath(roomId) {
    return `${roomDatabaseBasePath}/${roomId}`;
}

    function getScopedLocalParticipantStorageKey() {
    return `${localParticipantStorageKey}:${currentRoomId || ensureRoomId()}`;
}

    function unsubscribeWorkspaceListeners() {
    workspaceUnsubscribers.forEach((unsubscribe) => {
        try {
            unsubscribe();
        } catch (error) {
            console.warn("Workspace listener unsubscribe failed:", error);
        }
    });
    workspaceUnsubscribers = [];
}

    function resetWorkspaceRefs() {
    locationsRef = null;
    memosRef = null;
    usersRef = null;
    participantsRef = null;
}

    function resetWorkspaceData() {
    users = {};
    participantsConfigured = false;
    savedLocations = {};
    savedMemos = {};
    characters = [];
    editingMemoPersonId = null;
    clearSearchResults();
}

    function renderShareLink() {
    if (!shareLinkInput) {
    return;
}

    shareLinkInput.value = getShareUrl();
}

    async function copyShareLink() {
    const shareUrl = getShareUrl();

    try {
    if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareUrl);
} else {
    shareLinkInput.value = shareUrl;
    shareLinkInput.select();
    document.execCommand("copy");
}
    setSyncStatus("connected", "공유 링크를 복사했습니다. 이 링크를 친구에게 보내면 같은 방에 접속합니다.");
} catch (error) {
    shareLinkInput.focus();
    shareLinkInput.select();
    setSyncStatus("error", "자동 복사에 실패했습니다. 공유 링크 칸의 주소를 직접 복사하세요.");
}
}

    function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
}[character]));
}

    function clampParticipantCount(value) {
    const count = Number.parseInt(value, 10);
    if (!Number.isFinite(count)) {
    return defaultParticipantCount;
}

    return Math.min(Math.max(count, 1), maxParticipants);
}

    function getDraftParticipantNames() {
    return Array.from(participantNameFields.querySelectorAll("input"))
    .map((input) => input.value.trim());
}

    function renderParticipantNameFields(count = participantCountInput.value) {
    const safeCount = clampParticipantCount(count);
    const currentValues = getDraftParticipantNames();

    participantCountInput.value = String(safeCount);
    participantNameFields.innerHTML = Array.from({ length: safeCount }, (_, index) => {
    const value = currentValues[index] ?? characters[index]?.name ?? "";
    return `
          <label class="participant-name-row" for="participantName${index}">
            <span>${index + 1}번 이름</span>
            <input
              id="participantName${index}"
              type="text"
              maxlength="20"
              value="${escapeHtml(value)}"
              placeholder="이름 입력"
              required
            />
          </label>
        `;
}).join("");
}

    function normalizeParticipantNames(value) {
    const rawNames = Array.isArray(value?.names)
    ? value.names
    : Array.isArray(value)
    ? value.map((item) => item?.name ?? item)
    : [];

    return rawNames
    .map((name) => String(name || "").trim())
    .filter(Boolean)
    .slice(0, maxParticipants);
}

    function getParticipantInitial(name, index) {
    return Array.from(String(name || "").trim())[0] || String(index + 1);
}

    function buildCharacters(names) {
    characters = names.map((name, index) => {
        const id = `person${index + 1}`;

        return {
            id,
            name,
            initial: getParticipantInitial(name, index),
            color: participantColors[index % participantColors.length],
            location: normalizeLocation(savedLocations?.[id]),
            memo: normalizeMemo(savedMemos?.[id])
        };
    });
}

    function applyParticipants(participants) {
    const names = normalizeParticipantNames(participants);
    participantsConfigured = names.length > 0;

    if (participantsConfigured) {
    buildCharacters(names);
} else {
    characters = [];
    renderParticipantNameFields(defaultParticipantCount);
}
}

    function getUserLimit() {
    return participantsConfigured ? characters.length : maxParticipants;
}

    async function saveParticipantSetup(event) {
    event.preventDefault();

    const count = clampParticipantCount(participantCountInput.value);
    const names = getDraftParticipantNames()
    .slice(0, count)
    .map((name) => name.trim());

    if (names.some((name) => !name)) {
    setSyncStatus("error", "모든 참여자 이름을 입력하세요.");
    return;
}

    const duplicateName = names.find((name, index) => names.indexOf(name) !== index);
    if (duplicateName) {
    setSyncStatus("error", `"${duplicateName}" 이름이 중복되었습니다.`);
    return;
}

    const participants = {
    count: names.length,
    names,
    updatedAt: Date.now()
};

    saveParticipantSetupButton.disabled = true;

    try {
    if (!firebaseReady) {
    localStorage.setItem(getScopedLocalParticipantStorageKey(), JSON.stringify(participants));
    applyParticipants(participants);
    updateView();
    setSyncStatus("local", "명단이 이 브라우저에만 저장되었습니다.");
    return;
}

    if (!currentUser) {
    setSyncStatus("error", "공유 방의 명단을 만들려면 먼저 Google 로그인하세요.");
    return;
}

    if (!participantsRef || !usersRef || !locationsRef || !memosRef) {
    setSyncStatus("error", "공유 방 데이터 연결이 아직 준비되지 않았습니다. 잠시 후 다시 저장하세요.");
    return;
}

    await databaseApi.set(participantsRef, {
    ...participants,
    updatedAt: databaseApi.serverTimestamp()
});
    await Promise.all([
    databaseApi.set(usersRef, null),
    databaseApi.set(locationsRef, null),
    databaseApi.set(memosRef, null)
    ]);

    users = {};
    savedLocations = {};
    savedMemos = {};
    applyParticipants(participants);
    updateView();
    await registerSignedInUser(currentUser);
    setSyncStatus("connected", "참여자 명단이 공유 방에 저장되었습니다. 공유 링크를 친구에게 보내세요.");
} catch (error) {
    setSyncStatus("error", `명단 저장 실패: ${error.message}`);
} finally {
    saveParticipantSetupButton.disabled = false;
}
}

    function normalizeMemo(value) {
    return String(value ?? "").trim().slice(0, memoMaxLength);
}

    function normalizeLocation(value) {
    if (!value || !Number.isFinite(Number(value.lat)) || !Number.isFinite(Number(value.lng))) {
    return null;
}

    return {
    lat: Number(value.lat),
    lng: Number(value.lng),
    label: String(value.label || "").trim(),
    updatedAt: value.updatedAt || null
};
}

    function getCurrentUserRecord() {
    return currentUser ? users[currentUser.uid] ?? null : null;
}

    function getCurrentCharacterId() {
    return getCurrentUserRecord()?.characterId ?? "";
}

    function hasCurrentUserCharacterChoice() {
    return Boolean(getCurrentCharacterId());
}

    function getCharacterOwner(characterId) {
    const ownerEntry = Object.entries(users).find(([, user]) => user?.characterId === characterId);

    if (!ownerEntry) {
    return null;
}

    const [uid, profile] = ownerEntry;
    return { uid, profile };
}

    function canEditPerson(personId) {
    return Boolean(currentUser && getCurrentCharacterId() === personId);
}

    function getSelectedCharacters() {
    return characters.filter((person) => getCharacterOwner(person.id));
}

    function formatCoordinate(location) {
    if (!location) {
    return "";
}

    return `위도 ${location.lat.toFixed(5)}, 경도 ${location.lng.toFixed(5)}`;
}

    function isInsideSouthKoreaBounds(lat, lng) {
    const [[south, west], [north, east]] = southKoreaBounds;
    return lat >= south && lat <= north && lng >= west && lng <= east;
}

    function getLocationLabel(location) {
    if (!location) {
    return "위치 미선택";
}

    return location.label || formatCoordinate(location);
}

    function applyLocations(locations) {
    savedLocations = locations || {};
    characters.forEach((person) => {
    person.location = normalizeLocation(savedLocations?.[person.id]);
});
}

    function applyMemos(memos) {
    savedMemos = memos || {};
    characters.forEach((person) => {
    person.memo = normalizeMemo(savedMemos?.[person.id]);
});
}

    function createPersonIcon(person) {
    const L = window.L;

    return L.divIcon({
    className: "person-map-icon",
    html: `<span style="--color: ${person.color};">${escapeHtml(person.initial)}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
});
}

    function renderMapMarkers() {
    if (!markerLayer || !window.L) {
    return;
}

    markerLayer.clearLayers();

    getSelectedCharacters().forEach((person) => {
    if (!person.location) {
    return;
}

    const popupMemo = person.memo ? `<br />메모: ${escapeHtml(person.memo)}` : "";
    const marker = window.L.marker([person.location.lat, person.location.lng], {
    icon: createPersonIcon(person),
    title: person.name
});

    marker
    .bindPopup(`<strong>${escapeHtml(person.name)}</strong><br />${escapeHtml(getLocationLabel(person.location))}<br />${escapeHtml(formatCoordinate(person.location))}${popupMemo}`)
    .addTo(markerLayer);
});
}

    function initMap() {
    if (!window.L) {
    setSyncStatus("error", "지도 API를 불러오지 못했습니다. 인터넷 연결을 확인하세요.");
    return;
}

    const L = window.L;
    map = L.map("map", {
    minZoom: 6,
    maxBounds: southKoreaBounds,
    maxBoundsViscosity: 0.85
});

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
    map.fitBounds(southKoreaFitBounds);

    map.on("click", (event) => {
    if (!L.latLngBounds(southKoreaBounds).contains(event.latlng)) {
    setSyncStatus("error", "남한 지도 범위 안쪽 위치만 선택할 수 있습니다.");
    return;
}

    const characterId = getCurrentCharacterId();
    if (!currentUser) {
    setSyncStatus("error", "먼저 Google 계정으로 로그인하세요.");
    return;
}

    if (!characterId) {
    setSyncStatus("error", "먼저 내 사용자를 선택하세요.");
    return;
}

    saveLocation(characterId, event.latlng);
});

    setTimeout(() => map.invalidateSize(), 0);
}

    function resetMapView() {
    if (map) {
    map.fitBounds(southKoreaFitBounds);
}
}

    function clearSearchResults() {
    addressSearchResults = [];
    searchResults.innerHTML = "";
    searchResults.hidden = true;
}

    function getPrimarySearchLabel(label) {
    return String(label || "")
    .split(",")
    .slice(0, 3)
    .join(", ")
    .trim();
}

    function renderSearchResults(results) {
    addressSearchResults = results;

    if (!results.length) {
    searchResults.hidden = false;
    searchResults.innerHTML = `<div class="empty">검색 결과가 없습니다. 더 구체적인 주소나 장소명을 입력해 주세요.</div>`;
    return;
}

    searchResults.hidden = false;
    searchResults.innerHTML = results.map((result, index) => `
        <button class="search-result" type="button" data-search-result-index="${index}">
          <strong>${escapeHtml(getPrimarySearchLabel(result.label) || result.label)}</strong>
          <span>${escapeHtml(result.label)}</span>
          <span>${escapeHtml(formatCoordinate(result))}</span>
        </button>
      `).join("");

    searchResults.querySelectorAll("[data-search-result-index]").forEach((button) => {
    button.addEventListener("click", () => {
    selectSearchResult(Number(button.dataset.searchResultIndex));
});
});
}

    async function geocodeAddress(query) {
    const [[south, west], [north, east]] = southKoreaBounds;
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "5");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("countrycodes", "kr");
    url.searchParams.set("viewbox", `${west},${south},${east},${north}`);
    url.searchParams.set("bounded", "1");
    url.searchParams.set("accept-language", "ko");

    const response = await fetch(url.toString(), {
    headers: {
    "Accept": "application/json"
}
});

    if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
}

    const seen = new Set();
    const data = await response.json();
    return data
    .map((item) => ({
    lat: Number(item.lat),
    lng: Number(item.lon),
    label: String(item.display_name || query).trim()
}))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
    .filter((item) => isInsideSouthKoreaBounds(item.lat, item.lng))
    .filter((item) => {
    const key = `${item.lat.toFixed(6)},${item.lng.toFixed(6)},${item.label}`;
    if (seen.has(key)) {
    return false;
}
    seen.add(key);
    return true;
});
}

    async function searchAddress(event) {
    event.preventDefault();

    const query = addressSearchInput.value.trim();
    if (!query) {
    setSyncStatus("error", "검색할 주소나 장소명을 입력하세요.");
    addressSearchInput.focus();
    return;
}

    if (!currentUser) {
    setSyncStatus("error", "주소로 위치를 선택하려면 먼저 Google 계정으로 로그인하세요.");
    return;
}

    if (!getCurrentCharacterId()) {
    setSyncStatus("error", "주소로 위치를 선택하려면 먼저 내 사용자를 선택하세요.");
    return;
}

    const now = Date.now();
    if (now - lastAddressSearchAt < 1100) {
    setSyncStatus("error", "주소 검색은 1초에 한 번씩만 시도해 주세요.");
    return;
}

    lastAddressSearchAt = now;
    addressSearchButton.disabled = true;
    setSyncStatus("connected", "주소를 검색하고 있습니다.");

    try {
    const results = await geocodeAddress(query);
    renderSearchResults(results);
    setSyncStatus("connected", results.length ? "검색 결과 중 하나를 선택하세요." : "검색 결과가 없습니다.");
} catch (error) {
    clearSearchResults();
    setSyncStatus("error", `주소 검색 실패: ${error.message}`);
} finally {
    addressSearchButton.disabled = false;
}
}

    function selectSearchResult(index) {
    const result = addressSearchResults[index];
    const characterId = getCurrentCharacterId();

    if (!result || !characterId) {
    setSyncStatus("error", "선택할 검색 결과가 없습니다.");
    return;
}

    if (map) {
    map.setView([result.lat, result.lng], Math.max(map.getZoom(), 15));
}

    clearSearchResults();
    saveLocation(characterId, result, result.label);
}

    async function reverseGeocode(lat, lng) {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("zoom", "16");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "ko");

    try {
    const response = await fetch(url.toString(), {
    headers: {
    "Accept": "application/json"
}
});

    if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
}

    const data = await response.json();
    const countryCode = data?.address?.country_code;

    if (countryCode && countryCode !== "kr") {
    throw new Error("대한민국 남한 주소가 아닙니다.");
}

    return data?.display_name || "";
} catch (error) {
    console.warn("Reverse geocoding failed:", error);
    return "";
}
}

    async function saveLocation(personId, latlng, knownLabel = "") {
    const person = characters.find((item) => item.id === personId);
    if (!person || !canEditPerson(personId)) {
    setSyncStatus("error", "로그인한 계정에 연결된 사용자만 위치를 수정할 수 있습니다.");
    updateView();
    return;
}

    const lat = Number(latlng.lat.toFixed(6));
    const lng = Number(latlng.lng.toFixed(6));
    const coordinateLabel = `위도 ${lat.toFixed(5)}, 경도 ${lng.toFixed(5)}`;
    let addressLabel = String(knownLabel || "").trim();

    if (!addressLabel) {
    setSyncStatus("connected", "선택한 위치의 주소를 확인하고 있습니다.");
    addressLabel = await reverseGeocode(lat, lng);
}

    const location = {
    lat,
    lng,
    label: addressLabel || coordinateLabel,
    updatedAt: Date.now()
};

    person.location = location;
    updateView();

    if (!firebaseReady || !locationsRef) {
    setSyncStatus("local", "Firebase 연결 전이라 현재 기기에서만 위치가 변경되었습니다.");
    return;
}

    databaseApi.set(databaseApi.child(locationsRef, personId), {
    ...location,
    updatedAt: databaseApi.serverTimestamp()
})
    .then(() => {
    setSyncStatus("connected", "선택한 위치가 Firebase에 저장되었습니다.");
})
    .catch((error) => {
    setSyncStatus("error", `위치 저장 실패: ${error.message}`);
});
}

    function openMemoEditor(personId) {
    if (!canEditPerson(personId)) {
    setSyncStatus("error", "내 사용자의 메모만 수정할 수 있습니다.");
    return;
}

    editingMemoPersonId = personId;
    updateView();

    requestAnimationFrame(() => {
    const input = characterList.querySelector(`[data-memo-input-id="${personId}"]`);
    input?.focus();
    input?.select();
});
}

    function closeMemoEditor() {
    editingMemoPersonId = null;
    updateView();
}

    function saveMemo(personId, memoValue) {
    const person = characters.find((item) => item.id === personId);
    if (!person || !canEditPerson(personId)) {
    setSyncStatus("error", "내 사용자의 메모만 수정할 수 있습니다.");
    updateView();
    return;
}

    const nextMemo = normalizeMemo(memoValue);
    person.memo = nextMemo;
    editingMemoPersonId = null;
    updateView();

    if (!firebaseReady || !memosRef) {
    setSyncStatus("local", "Firebase 연결 전이라 현재 기기에서만 변경되었습니다.");
    return;
}

    databaseApi.set(databaseApi.child(memosRef, personId), nextMemo)
    .then(() => {
    setSyncStatus("connected", "메모가 Firebase에 저장되었습니다.");
})
    .catch((error) => {
    setSyncStatus("error", `메모 저장 실패: ${error.message}`);
});
}

    function focusPersonLocation(personId) {
    const person = characters.find((item) => item.id === personId);
    if (!map || !person?.location) {
    return;
}

    map.setView([person.location.lat, person.location.lng], Math.max(map.getZoom(), 13));
}

    function renderCharacterPicker() {
    const currentCharacterId = getCurrentCharacterId();
    const hasLockedChoice = hasCurrentUserCharacterChoice();
    const placeholder = !participantsConfigured
    ? "명단 저장 후 선택"
    : hasLockedChoice
    ? "선택 완료"
    : currentUser
    ? "사용자를 선택하세요"
    : "로그인 후 선택";
    const characterOptions = characters.map((person) => {
    const owner = getCharacterOwner(person.id);
    const isMine = owner?.uid === currentUser?.uid;
    const isDisabled = Boolean(owner && !isMine);
    const statusText = isMine ? " - 내 사용자" : isDisabled ? " - 사용 중" : "";

    return `
          <option value="${person.id}" ${isDisabled ? "disabled" : ""}>
            ${escapeHtml(person.name + statusText)}
          </option>
        `;
}).join("");

    characterSelect.innerHTML = `
        <option value="">${placeholder}</option>
        ${characterOptions}
      `;
    characterSelect.value = currentCharacterId;
    characterSelect.disabled = !participantsConfigured || !currentUser || !firebaseReady || hasLockedChoice;
}

    function renderAuthPanel() {
    const userCount = Object.keys(users).length;
    const userRecord = getCurrentUserRecord();
    const userLimit = getUserLimit();

    memberCount.textContent = participantsConfigured
    ? `참여 계정 ${Math.min(userCount, userLimit)}/${userLimit}`
    : "명단 설정 전";
    signInButton.hidden = Boolean(currentUser);
    signOutButton.hidden = !currentUser;

    if (!currentUser) {
    accountName.textContent = "로그인 전";
    accountEmail.textContent = "Google 로그인 후 사용자를 선택할 수 있습니다.";
} else {
    accountName.textContent = currentUser.displayName || "이름 없는 계정";
    accountEmail.textContent = currentUser.email || "이메일 없음";
}

    if (currentUser && !userRecord) {
    accountEmail.textContent = "계정 정보를 확인하고 있습니다.";
}

    renderShareLink();
    renderCharacterPicker();
}

    function renderSetupState() {
    setupPanel.hidden = participantsConfigured;
    appShell.hidden = !participantsConfigured;

    if (!participantsConfigured && !participantNameFields.children.length) {
    renderParticipantNameFields(defaultParticipantCount);
}

    if (participantsConfigured && map) {
    setTimeout(() => map.invalidateSize(), 0);
}
}

    function renderCharacters() {
    characterList.innerHTML = characters.map((person) => {
        const memo = normalizeMemo(person.memo);
        const safeName = escapeHtml(person.name);
        const canEdit = canEditPerson(person.id);
        const owner = getCharacterOwner(person.id);
        const rowStateClass = canEdit ? "my-character" : owner ? "locked" : "";
        const ownerBadgeClass = canEdit ? "mine" : owner ? "used" : "";
        const ownerLabel = canEdit ? "내 사용자" : owner ? "사용 중" : "미선택";
        const locationLabel = owner ? getLocationLabel(person.location) : "사용자 선택 전";
        const coordinateText = person.location ? formatCoordinate(person.location) : "";
        const isEditingMemo = canEdit && editingMemoPersonId === person.id;
        const memoHtml = isEditingMemo
            ? `
            <form class="memo-editor" data-memo-person-id="${person.id}">
              <label class="sr-only" for="memo-${person.id}">${safeName} 메모 입력</label>
              <input
                id="memo-${person.id}"
                class="memo-input"
                data-memo-input-id="${person.id}"
                type="text"
                maxlength="${memoMaxLength}"
                value="${escapeHtml(memo)}"
                placeholder="메모 입력"
              />
              <button class="memo-action primary" type="submit">저장</button>
              <button class="memo-action" type="button" data-memo-cancel="${person.id}">취소</button>
              <span class="memo-count">${memo.length}/${memoMaxLength}</span>
            </form>
          `
            : `<div class="memo-line ${memo ? "" : "empty-memo"}">${memo ? escapeHtml(memo) : "메모 없음"}</div>`;

        return `
          <article class="character-row ${rowStateClass}">
            <div class="avatar" style="--color: ${person.color};" aria-hidden="true">${escapeHtml(person.initial)}</div>
            <div class="character-info">
              <div class="name-line">
                <button class="name-button" type="button" data-memo-person-id="${person.id}" title="메모 추가/수정" ${canEdit ? "" : "disabled"}>${safeName}</button>
                <span class="owner-badge ${ownerBadgeClass}">${ownerLabel}</span>
              </div>
              <div class="location-line ${person.location ? "" : "empty-location"}">${escapeHtml(locationLabel)}</div>
              ${coordinateText ? `<div class="coordinate-line">${escapeHtml(coordinateText)}</div>` : ""}
              ${memoHtml}
            </div>
          </article>
        `;
    }).join("");

    characterList.querySelectorAll(".name-button").forEach((button) => {
    button.addEventListener("click", () => {
    openMemoEditor(button.dataset.memoPersonId);
});
});

    characterList.querySelectorAll(".memo-editor").forEach((form) => {
    const input = form.querySelector(".memo-input");
    const count = form.querySelector(".memo-count");

    input.addEventListener("input", () => {
    input.value = input.value.slice(0, memoMaxLength);
    count.textContent = `${input.value.length}/${memoMaxLength}`;
});

    form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveMemo(form.dataset.memoPersonId, input.value);
});
});

    characterList.querySelectorAll("[data-memo-cancel]").forEach((button) => {
    button.addEventListener("click", closeMemoEditor);
});
}

    function renderLocationList() {
    const selectedPeople = getSelectedCharacters().filter((person) => person.location);

    if (!selectedPeople.length) {
    locationList.innerHTML = `<div class="empty">아직 지도에서 위치를 선택한 사용자가 없습니다.</div>`;
    return;
}

    locationList.innerHTML = selectedPeople.map((person) => `
        <article class="location-row">
          <div class="avatar" style="--color: ${person.color};" aria-hidden="true">${escapeHtml(person.initial)}</div>
          <div class="location-info">
            <div class="name-line">
              <strong>${escapeHtml(person.name)}</strong>
              <button class="focus-button" type="button" data-focus-person-id="${person.id}">지도 보기</button>
            </div>
            <div class="location-line">${escapeHtml(getLocationLabel(person.location))}</div>
            <div class="coordinate-line">${escapeHtml(formatCoordinate(person.location))}</div>
            ${person.memo ? `<div class="memo-line">${escapeHtml(person.memo)}</div>` : ""}
          </div>
        </article>
      `).join("");

    locationList.querySelectorAll("[data-focus-person-id]").forEach((button) => {
    button.addEventListener("click", () => {
    focusPersonLocation(button.dataset.focusPersonId);
});
});
}

    function updateView() {
    renderSetupState();
    renderAuthPanel();
    renderCharacters();
    renderLocationList();
    renderMapMarkers();
}

    async function loadFirebaseSdk() {
    const [appSdk, dbSdk, authSdk] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js"),
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js")
    ]);

    databaseApi = dbSdk;
    authApi = authSdk;

    return {
    initializeApp: appSdk.initializeApp,
    ...dbSdk,
    ...authSdk
};
}

    function attachUserWorkspace(ref, onValue) {
    unsubscribeWorkspaceListeners();
    resetWorkspaceRefs();
    resetWorkspaceData();

    const roomPath = getRoomDatabasePath(currentRoomId || ensureRoomId());
    participantsRef = ref(firebaseDatabase, `${roomPath}/participants`);
    locationsRef = ref(firebaseDatabase, `${roomPath}/locations`);
    memosRef = ref(firebaseDatabase, `${roomPath}/memos`);
    usersRef = ref(firebaseDatabase, `${roomPath}/users`);

    workspaceUnsubscribers = [
    onValue(participantsRef, (snapshot) => {
    applyParticipants(snapshot.val());
    updateView();

    if (!participantsConfigured) {
    setSyncStatus("local", "이 공유 방에는 아직 명단이 없습니다. 새 사용자 명단을 입력하고 저장하세요.");
}
}, (error) => {
    setSyncStatus("error", `참여자 명단 불러오기 실패: ${error.message}`);
}),

    onValue(locationsRef, (snapshot) => {
    applyLocations(snapshot.val());
    updateView();
    if (participantsConfigured) {
    setSyncStatus("connected", "공유 방의 위치를 Firebase와 동기화 중입니다.");
}
}, (error) => {
    setSyncStatus("error", `위치 불러오기 실패: ${error.message}`);
}),

    onValue(memosRef, (snapshot) => {
    applyMemos(snapshot.val());
    updateView();
}, (error) => {
    setSyncStatus("error", `메모 불러오기 실패: ${error.message}`);
}),

    onValue(usersRef, (snapshot) => {
    users = snapshot.val() || {};
    updateView();
}, (error) => {
    setSyncStatus("error", `계정 정보 불러오기 실패: ${error.message}`);
})
    ];

    updateView();
}

    async function registerSignedInUser(user) {
    const snapshot = await databaseApi.get(usersRef);
    const savedUsers = snapshot.val() || {};
    const savedUser = savedUsers[user.uid] || null;
    const userCount = Object.keys(savedUsers).length;
    const userLimit = getUserLimit();

    if (participantsConfigured && !savedUser && userCount >= userLimit) {
    setSyncStatus("error", `이미 ${userLimit}개의 Google 계정이 참여 중입니다.`);
    await authApi.signOut(auth);
    return;
}

    const updates = {
    displayName: user.displayName || "이름 없는 계정",
    email: user.email || "",
    photoURL: user.photoURL || "",
    lastSeen: databaseApi.serverTimestamp()
};

    if (!savedUser) {
    updates.joinedAt = databaseApi.serverTimestamp();
}

    await databaseApi.update(databaseApi.child(usersRef, user.uid), updates);
    setSyncStatus("connected", "Google 계정 로그인이 완료되었습니다.");
}

    async function signInWithGoogle() {
    if (!auth) {
    setSyncStatus("error", "Firebase Auth가 아직 준비되지 않았습니다.");
    return;
}

    const provider = new authApi.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    signInButton.disabled = true;

    try {
    await authApi.signInWithPopup(auth, provider);
} catch (error) {
    setSyncStatus("error", `Google 로그인 실패: ${error.message}`);
} finally {
    signInButton.disabled = false;
}
}

    async function signOutCurrentUser() {
    if (!auth) {
    return;
}

    try {
    await authApi.signOut(auth);
    editingMemoPersonId = null;
    setSyncStatus("connected", "로그아웃되었습니다.");
} catch (error) {
    setSyncStatus("error", `로그아웃 실패: ${error.message}`);
}
}

    async function saveCharacterChoice(characterId) {
    if (!participantsConfigured) {
    setSyncStatus("error", "먼저 참여자 명단을 저장하세요.");
    updateView();
    return;
}

    if (!currentUser || !usersRef || !characterId) {
    return;
}

    const currentCharacterId = getCurrentCharacterId();
    const selectedCharacter = characters.find((person) => person.id === characterId);
    const owner = getCharacterOwner(characterId);

    if (currentCharacterId) {
    if (currentCharacterId === characterId) {
    setSyncStatus("connected", "이미 이 Google 계정에 연결된 사용자입니다.");
} else {
    setSyncStatus("error", "이미 이 Google 계정에 사용자가 연결되어 있어 다른 사용자로 변경할 수 없습니다.");
}
    characterSelect.value = currentCharacterId;
    updateView();
    return;
}

    if (!selectedCharacter) {
    setSyncStatus("error", "존재하지 않는 사용자입니다.");
    updateView();
    return;
}

    if (owner && owner.uid !== currentUser.uid) {
    setSyncStatus("error", "이미 다른 계정이 선택한 사용자입니다.");
    updateView();
    return;
}

    try {
    await databaseApi.update(databaseApi.child(usersRef, currentUser.uid), {
    characterId,
    lastSeen: databaseApi.serverTimestamp()
});
    users[currentUser.uid] = {
    ...(users[currentUser.uid] || {}),
    characterId,
    displayName: currentUser.displayName || "이름 없는 계정",
    email: currentUser.email || "",
    photoURL: currentUser.photoURL || "",
    lastSeen: Date.now()
};
    editingMemoPersonId = null;
    updateView();
    setSyncStatus("connected", `${selectedCharacter.name} 사용자가 계정에 연결되었습니다. 이제 지도에서 위치를 클릭하세요.`);
} catch (error) {
    setSyncStatus("error", `사용자 선택 저장 실패: ${error.message}`);
}
}

    async function startFirebaseSync() {
    updateView();

    if (!isFirebaseConfigured()) {
    try {
    const localParticipants = JSON.parse(localStorage.getItem(getScopedLocalParticipantStorageKey()) || "null");
    applyParticipants(localParticipants);
    updateView();
} catch (error) {
    console.warn("Local participant setup load failed:", error);
}
    setSyncStatus("local", "Firebase 설정을 입력하면 Google 로그인과 실시간 동기화가 작동합니다.");
    return;
}

    try {
    const {
    initializeApp,
    getAuth,
    getDatabase,
    ref,
    onValue,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} = await loadFirebaseSdk();

    const app = initializeApp(getFirebaseConfig());
    firebaseDatabase = getDatabase(app);
    auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);

    firebaseReady = true;

    onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    editingMemoPersonId = null;

    if (!user) {
    unsubscribeWorkspaceListeners();
    resetWorkspaceRefs();
    resetWorkspaceData();
    updateView();
    setSyncStatus("local", "Google 로그인 후 이 공유 방에 참여할 수 있습니다.");
    return;
}

    attachUserWorkspace(ref, onValue);
    setSyncStatus("connected", "공유 방 데이터를 불러오고 있습니다.");

    try {
    await registerSignedInUser(user);
} catch (error) {
    setSyncStatus("error", `계정 등록 실패: ${error.message}`);
}
});
} catch (error) {
    firebaseReady = false;
    updateView();
    setSyncStatus("error", `Firebase 초기화 실패: ${error.message}`);
}
}

    signInButton.addEventListener("click", signInWithGoogle);
    signOutButton.addEventListener("click", signOutCurrentUser);
    copyShareLinkButton.addEventListener("click", copyShareLink);
    participantCountInput.addEventListener("input", () => {
    if (!participantCountInput.value) {
    return;
}
    renderParticipantNameFields(participantCountInput.value);
});
    participantSetupForm.addEventListener("submit", saveParticipantSetup);
    characterSelect.addEventListener("change", (event) => {
    saveCharacterChoice(event.target.value);
});
    resetMapButton.addEventListener("click", resetMapView);
    addressSearchForm.addEventListener("submit", searchAddress);

    ensureRoomId();
    initMap();
    startFirebaseSync();
