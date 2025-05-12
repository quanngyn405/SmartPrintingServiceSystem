class User{
  constructor({userId, userName, email, password, role, createAt}){
      this.userId = userId,
      this.userName = userName,
      this.email = email,
      this.password = password,
      this.role = role, // "studetnt or SPSO"
      this.createAt  = createAt || new Date();
  }

  static create({userName, email, password, role}){
      return new User({
          userId: null,
          userName,
          email,
          password,
          role,
          createAt: new Date()
      })
  }
}


export default User;