class UserDomain:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
    
    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "password": self.password
        }



#import re
#from werkzeug.security import generate_password_hash, check_password_hash

#class UserDomain:
 #   def __init__(self, name, email, password):
  #      self.name = name
   #     self.email = email
    #    self.password = password
     #   self._validate_email() 
      #  self.password_hash = self._hash_password(password)
    
    #def _validate_email(self):

     #   email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
      #  if not re.match(email_regex, self.email):
       #     raise ValueError(f"Email '{self.email}' não é válido.")
    
   # def _hash_password(self, password):

    #    return generate_password_hash(password)
    
    #def check_password(self, password):

     #   return check_password_hash(self.password_hash, password)
    
    #def to_dict(self):

     #   return {
      #      "name": self.name,
       #     "email": self.email,
        #    "password_hash": self.password_hash
       # }
    
    #def __repr__(self):
     #   return f"User(name={self.name}, email={self.email})"
