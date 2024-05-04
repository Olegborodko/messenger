class UserSession {
  constructor() {
    this.currentIndex = null;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  setCurrentIndex(index) {
    this.currentIndex = index;
  }

  getCurrentValue(value) {
    const arr = value.split('|');

    if (arr[this.currentIndex]) {
      return arr[this.currentIndex];
    } else {
      return null;
    }
  }
}

const userSession = new UserSession();

module.exports = userSession;
