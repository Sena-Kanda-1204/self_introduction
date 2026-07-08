/* =========================
   DataManager（唯一のデータ管理層）
========================= */

const STORAGE_KEY = "events";

const DataManager = {

    _cache: [],

    // 初期化
    async init() {
        const local = this.loadLocal();

        if (local.length > 0) {
            this._cache = local;
        } else {
            this._cache = await this.fetchInitial();
            this.saveLocal();
        }

        return this._cache;
    },

    // JSON初期データ取得
    async fetchInitial() {
        try {
            const res = await fetch("./data.json");
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    },

    // localStorage読み込み
    loadLocal() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    },

    // 保存
    saveLocal() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
    },

    // 全取得
    getAll() {
        return this._cache;
    },

    // 追加
    add(event) {
        this._cache.push(event);
        this.saveLocal();
    },

    // 更新
    update(id, newData) {
        const index = this._cache.findIndex(e => e.id === id);
        if (index === -1) return;

        this._cache[index] = {
            ...this._cache[index],
            ...newData
        };

        this.saveLocal();
    },

    // 削除
    delete(id) {
        this._cache = this._cache.filter(e => e.id !== id);
        this.saveLocal();
    },

    // 単体取得
    find(id) {
        return this._cache.find(e => e.id === id);
    }
};

// グローバル公開（段階移行用）
window.DataManager = DataManager;