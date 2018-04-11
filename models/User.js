

class User {
  constructor(_firstName = '', _lateName = '') {
    this.firstName = _firstName;
    this.lastName = _lateName;
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  set name(fullName) {
    this.firstName = fullName.split(' ')[0];
    this.lastName = fullName.split(' ')[1];
    return this;
  }
}

module.exports = User;