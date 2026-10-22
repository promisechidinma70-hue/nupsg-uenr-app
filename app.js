/* ========== NUPS-G UENR APP ========== */
const APP = {
  currentUser: null,
  currentPage: 'home',
  posts: [],
  chats: [],
  currentChat: null,
  deferredPrompt: null,

  wings: [
    { id: 'bible', name: 'Bible', icon: '📖', members: 48, desc: 'Deep study of the Word' },
    { id: 'prayer', name: 'Prayer', icon: '🙏', members: 62, desc: 'Intercession & spiritual warfare' },
    { id: 'evangelism', name: 'Evangelism', icon: '✝️', members: 55, desc: 'Soul winning & outreach' },
    { id: 'reformed', name: 'Reformed Vessels', icon: '🔥', members: 37, desc: 'Worship & creative ministry' },
    { id: 'pearls', name: 'Pearls of Zion', icon: '💎', members: 41, desc: 'Women of purpose & excellence' },
    { id: 'media', name: 'Media', icon: '🎬', members: 29, desc: 'Content, design & tech' },
    { id: 'coordination', name: 'Coordination Team', icon: '🤝', members: 18, desc: 'Leadership & administration' }
  ],

  init() {
    this.loadData();
    this.bindEvents();
    this.checkAuth();
    this.registerSW();
    this.setupInstall();
  },

  loadData() {
    const user = localStorage.getItem('nupsg_user');
    if (user) this.currentUser = JSON.parse(user);

    const dataVersion = '2';  // bump this when seed content changes
    if (localStorage.getItem('nupsg_data_version') !== dataVersion) {
      this.posts = this.getSeedPosts();
      this.savePosts();
      localStorage.setItem('nupsg_data_version', dataVersion);
    } else {
      this.posts = JSON.parse(localStorage.getItem('nupsg_posts') || '[]');
      if (this.posts.length === 0) {
        this.posts = this.getSeedPosts();
        this.savePosts();
      }
    }

    this.chats = JSON.parse(localStorage.getItem('nupsg_chats') || '[]');
    if (this.chats.length === 0) {
      this.chats = this.getSeedChats();
      localStorage.setItem('nupsg_chats', JSON.stringify(this.chats));
    }

    // Theme
    const theme = localStorage.getItem('nupsg_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  },

  getSeedPosts() {
    return [
      {
        id: 1,
        author: 'NUPS-G UENR Executives',
        initials: 'NE',
        time: '2 hours ago',
        content: 'Welcome to the official NUPS-G UENR App! 🎉\n\n"For to me, to live is Christ and to die is gain." — Philippians 1:21\n\nEven if you are already in our WhatsApp groups, please join your preferred Wing(s) here in the app so we can stay connected and grow together.',
        image: null,
        likes: 42,
        comments: 8,
        liked: false
      },
      {
        id: 2,
        author: 'Prayer Wing',
        initials: 'PW',
        time: '5 hours ago',
        content: '🙏 Prayer Wing – Paniel Encounter\n\nJoin us this Friday for prayer!\n\n🕘 Time: 7:00 PM – 9:00 PM\n📍 Venue: UENR School Field\n\nCome expectant. Come ready to encounter God. 🔥',
        image: null,
        likes: 28,
        comments: 5,
        liked: false
      },
      {
        id: 3,
        author: 'Bible Study Coordinator',
        initials: 'BS',
        time: 'Yesterday',
        content: '📖 Bible Wing (Newly Formed)\n\nTheme: I\'m a Berean\n\nScripture: Acts 17:11\n\n"These were more noble than those in Thessalonica, in that they received the word with all readiness of mind, and searched the scriptures daily, whether those things were so."\n\nJoin the Bible Wing and grow deep in the Word!',
        image: null,
        likes: 35,
        comments: 3,
        liked: false
      }
    ];
  },

  getSeedChats() {
    return [
      {
        id: 'general',
        name: 'General Announcements',
        initials: 'GA',
        preview: 'Welcome everyone to the platform!',
        time: 'Now',
        messages: [
          { text: 'Welcome everyone to the NUPS-G UENR platform!', sent: false, time: '10:00' },
          { text: 'Feel free to introduce yourself and join a wing.', sent: false, time: '10:01' }
        ]
      },
      {
        id: 'prayer',
        name: 'Prayer Requests',
        initials: 'PR',
        preview: 'Lift up one another in prayer',
        time: '1h',
        messages: [
          { text: 'Please pray for our upcoming exams.', sent: false, time: '09:30' },
          { text: 'Praying with you! 🙏', sent: true, time: '09:45' }
        ]
      },
      {
        id: 'evangelism',
        name: 'Evangelism Team',
        initials: 'ET',
        preview: 'Outreach this Saturday',
        time: '3h',
        messages: [
          { text: 'Outreach to the community this Saturday 7am. Who\'s in?', sent: false, time: '08:00' }
        ]
      }
    ];
  },

  savePosts() {
    localStorage.setItem('nupsg_posts', JSON.stringify(this.posts));
  },

  saveUser() {
    if (this.currentUser) {
      localStorage.setItem('nupsg_user', JSON.stringify(this.currentUser));
    }
  },

  checkAuth() {
    if (this.currentUser) {
      document.getElementById('auth-screen').classList.add('hidden');
      document.getElementById('app').classList.add('active');
      this.renderAll();
    } else {
      document.getElementById('auth-screen').classList.remove('hidden');
      document.getElementById('app').classList.remove('active');
    }
  },

  bindEvents() {
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.getElementById('login-form').classList.toggle('hidden', target !== 'login');
        document.getElementById('signup-form').classList.toggle('hidden', target !== 'signup');
      });
    });

    // Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!email || !password) return this.toast('Please fill all fields');

      // Demo: accept any credentials or previously signed up
      const users = JSON.parse(localStorage.getItem('nupsg_users') || '[]');
      let user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        // Allow demo login
        user = {
          id: Date.now(),
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email,
          password,
          wings: [],
          joined: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('nupsg_users', JSON.stringify(users));
      }
      this.currentUser = user;
      this.saveUser();
      this.checkAuth();
      this.toast(`Welcome back, ${user.name.split(' ')[0]}! 🙌`);
    });

    // Signup
    document.getElementById('signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const level = document.getElementById('signup-level').value;

      if (!name || !email || !password) return this.toast('Please fill all fields');
      if (password.length < 4) return this.toast('Password too short');

      const users = JSON.parse(localStorage.getItem('nupsg_users') || '[]');
      if (users.find(u => u.email === email)) {
        return this.toast('Email already registered. Please log in.');
      }

      const user = {
        id: Date.now(),
        name,
        email,
        password,
        level,
        wings: [],
        joined: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem('nupsg_users', JSON.stringify(users));
      this.currentUser = user;
      this.saveUser();
      this.checkAuth();
      this.toast(`Welcome to NUPS-G UENR, ${name.split(' ')[0]}! 🎉`);
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        this.navigate(page);
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nupsg_theme', next);
      this.toast(next === 'dark' ? 'Dark mode on 🌙' : 'Light mode on ☀️');
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.currentUser = null;
      localStorage.removeItem('nupsg_user');
      this.checkAuth();
      this.toast('Logged out successfully');
    });

    // Post composer
    document.getElementById('post-btn').addEventListener('click', () => this.createPost());
    document.getElementById('post-image-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.getElementById('image-preview').src = ev.target.result;
          document.getElementById('image-preview-wrap').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
    document.getElementById('remove-image').addEventListener('click', () => {
      document.getElementById('image-preview-wrap').classList.add('hidden');
      document.getElementById('post-image-input').value = '';
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
      this.renderSearch(e.target.value);
    });

    // Chat send
    document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

    // Hide chat view when leaving messages
    if (page !== 'messages') {
      document.getElementById('chat-list-view').classList.remove('hidden');
      document.getElementById('chat-view').classList.remove('active');
    }

    if (page === 'home') this.renderFeed();
    if (page === 'wings') this.renderWings();
    if (page === 'messages') this.renderChats();
    if (page === 'profile') this.renderProfile();
    if (page === 'search') this.renderSearch('');
  },

  renderAll() {
    this.renderFeed();
    this.renderWings();
    this.renderChats();
    this.renderProfile();
    document.getElementById('user-greeting').textContent = this.currentUser.name.split(' ')[0];
  },

  renderFeed() {
    const feed = document.getElementById('feed');
    if (this.posts.length === 0) {
      feed.innerHTML = `<div class="empty-state"><p>No posts yet. Be the first to share!</p></div>`;
      return;
    }
    feed.innerHTML = this.posts.map(p => `
      <article class="post" data-id="${p.id}">
        <div class="post-header">
          <div class="avatar">${p.initials}</div>
          <div class="post-meta">
            <div class="post-author">${this.escape(p.author)}</div>
            <div class="post-time">${p.time}</div>
          </div>
        </div>
        <div class="post-content">${this.escape(p.content)}</div>
        ${p.image ? `<img class="post-image" src="${p.image}" alt="Post image">` : ''}
        <div class="post-actions">
          <button class="post-action ${p.liked ? 'liked' : ''}" onclick="APP.toggleLike(${p.id})">
            <span>${p.liked ? '❤️' : '🤍'}</span> ${p.likes}
          </button>
          <button class="post-action">
            <span>💬</span> ${p.comments}
          </button>
          <button class="post-action" onclick="APP.toast('Shared!')">
            <span>🔗</span> Share
          </button>
        </div>
      </article>
    `).join('');
  },

  createPost() {
    const text = document.getElementById('post-text').value.trim();
    const imgPreview = document.getElementById('image-preview');
    const hasImage = !document.getElementById('image-preview-wrap').classList.contains('hidden');

    if (!text && !hasImage) return this.toast('Write something or add an image');

    const post = {
      id: Date.now(),
      author: this.currentUser.name,
      initials: this.getInitials(this.currentUser.name),
      time: 'Just now',
      content: text,
      image: hasImage ? imgPreview.src : null,
      likes: 0,
      comments: 0,
      liked: false
    };
    this.posts.unshift(post);
    this.savePosts();
    document.getElementById('post-text').value = '';
    document.getElementById('image-preview-wrap').classList.add('hidden');
    document.getElementById('post-image-input').value = '';
    this.renderFeed();
    this.toast('Post shared! 🙌');
  },

  toggleLike(id) {
    const post = this.posts.find(p => p.id === id);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    this.savePosts();
    this.renderFeed();
  },

  renderWings() {
    const grid = document.getElementById('wings-grid');
    const joined = this.currentUser.wings || [];
    grid.innerHTML = this.wings.map(w => {
      const isJoined = joined.includes(w.id);
      return `
        <div class="wing-card ${isJoined ? 'joined' : ''}" onclick="APP.toggleWing('${w.id}')">
          ${isJoined ? '<span class="wing-badge">Joined</span>' : ''}
          <div class="wing-icon">${w.icon}</div>
          <div class="wing-name">${w.name}</div>
          <div class="wing-members">${w.members + (isJoined ? 1 : 0)} members</div>
        </div>
      `;
    }).join('');
  },

  toggleWing(id) {
    if (!this.currentUser.wings) this.currentUser.wings = [];
    const idx = this.currentUser.wings.indexOf(id);
    const wing = this.wings.find(w => w.id === id);
    if (idx > -1) {
      this.currentUser.wings.splice(idx, 1);
      this.toast(`Left ${wing.name}`);
    } else {
      this.currentUser.wings.push(id);
      this.toast(`Joined ${wing.name}! Welcome 🙌`);
    }
    this.saveUser();
    this.renderWings();
    this.renderProfile();
  },

  renderChats() {
    const list = document.getElementById('chat-list');
    list.innerHTML = this.chats.map(c => `
      <div class="chat-item" onclick="APP.openChat('${c.id}')">
        <div class="avatar sm">${c.initials}</div>
        <div class="chat-info">
          <div class="chat-name">${this.escape(c.name)}</div>
          <div class="chat-preview">${this.escape(c.preview)}</div>
        </div>
        <div class="chat-time">${c.time}</div>
      </div>
    `).join('');
  },

  openChat(id) {
    this.currentChat = this.chats.find(c => c.id === id);
    if (!this.currentChat) return;
    document.getElementById('chat-list-view').classList.add('hidden');
    document.getElementById('chat-view').classList.add('active');
    document.getElementById('chat-title').textContent = this.currentChat.name;
    this.renderMessages();
  },

  closeChat() {
    document.getElementById('chat-list-view').classList.remove('hidden');
    document.getElementById('chat-view').classList.remove('active');
    this.currentChat = null;
  },

  renderMessages() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = this.currentChat.messages.map(m => `
      <div class="message ${m.sent ? 'sent' : 'received'}">${this.escape(m.text)}</div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  },

  sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || !this.currentChat) return;
    this.currentChat.messages.push({ text, sent: true, time: 'Now' });
    this.currentChat.preview = text;
    this.currentChat.time = 'Now';
    localStorage.setItem('nupsg_chats', JSON.stringify(this.chats));
    input.value = '';
    this.renderMessages();
  },

  renderProfile() {
    const u = this.currentUser;
    document.getElementById('profile-name').textContent = u.name;
    document.getElementById('profile-email').textContent = u.email;
    document.getElementById('profile-avatar').textContent = this.getInitials(u.name);
    document.getElementById('profile-level').textContent = u.level ? `Level ${u.level}` : 'Member';
    document.getElementById('profile-wings-count').textContent = (u.wings || []).length;
    document.getElementById('profile-posts-count').textContent = this.posts.filter(p => p.author === u.name).length;

    const wingsList = document.getElementById('profile-wings-list');
    if ((u.wings || []).length === 0) {
      wingsList.innerHTML = `<p class="text-muted text-sm">You haven't joined any wing yet. Go to Wings and join!</p>`;
    } else {
      wingsList.innerHTML = (u.wings || []).map(id => {
        const w = this.wings.find(x => x.id === id);
        return `<span class="btn btn-sm btn-secondary" style="margin:4px">${w?.icon} ${w?.name}</span>`;
      }).join('');
    }
  },

  renderSearch(query) {
    const q = query.toLowerCase().trim();
    const results = document.getElementById('search-results');
    if (!q) {
      results.innerHTML = `
        <div class="empty-state">
          <p>Search posts, wings, or members</p>
        </div>`;
      return;
    }

    const matchedPosts = this.posts.filter(p =>
      p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    );
    const matchedWings = this.wings.filter(w =>
      w.name.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q)
    );

    let html = '';
    if (matchedWings.length) {
      html += `<h3 class="font-bold mb-2 mt-3">Wings</h3>`;
      html += matchedWings.map(w => `
        <div class="chat-item" onclick="APP.navigate('wings')">
          <div class="avatar sm">${w.icon}</div>
          <div class="chat-info">
            <div class="chat-name">${w.name}</div>
            <div class="chat-preview">${w.desc}</div>
          </div>
        </div>
      `).join('');
    }
    if (matchedPosts.length) {
      html += `<h3 class="font-bold mb-2 mt-3">Posts</h3>`;
      html += matchedPosts.map(p => `
        <div class="card"><div class="card-body">
          <div class="font-bold">${this.escape(p.author)}</div>
          <div class="text-sm text-muted">${p.time}</div>
          <p class="mt-2">${this.escape(p.content.slice(0, 120))}${p.content.length > 120 ? '…' : ''}</p>
        </div></div>
      `).join('');
    }
    if (!html) html = `<div class="empty-state"><p>No results for "${this.escape(query)}"</p></div>`;
    results.innerHTML = html;
  },

  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  },

  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  },

  setupInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const banner = document.getElementById('install-banner');
      if (banner) banner.classList.remove('hidden');
    });
    document.getElementById('install-btn')?.addEventListener('click', async () => {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      document.getElementById('install-banner')?.classList.add('hidden');
    });
    document.getElementById('dismiss-install')?.addEventListener('click', () => {
      document.getElementById('install-banner')?.classList.add('hidden');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => APP.init());
