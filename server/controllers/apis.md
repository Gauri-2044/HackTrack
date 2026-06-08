## APIs

NOTE : If it is the error from DB then always say
"Internal Server Error" : 500 -> TRY AGAIN LATER

in each request other than login and register JWT token is passed

### Hashing
npm install bcrypt

### Test API in cmd :
curl.exe -X POST -H "Content-Type: application/json" -d '{"teamName":"TestTeam","teamCode":"12345"}' http://localhost:5000/api/auth/register

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body '{"teamName":"TestTeam","teamCode":"12345"}' -ContentType "application/json"

Get-ChildItem -Recurse -Filter "*.js" | Select-String "hashedCode"

#### BASE_URL = "http://localhost:5000"

#### Login 

URL : POST http://localhost:5000/auth/login
Client : {
            teamName   //must be Unique
            teamCode
        }
Server:
    success: "Login successful." : 200
    error: "Authentication Failed"
        Missing email or password. or Invalid email format. : 400
        No User found : 401
        Password not Matched : 401
        Account is locked due to multiple failed attempts: 429
        Account is locked due to multiple failed attempts.: 403

#### Register

URL: POST http://localhost:5000/auth/register
members[] = {member} //add later

Client : {
            teamName   //must be Unique
            teamCode
        }
Server :
    Success :
        User registered successfully. : 201
        Registration successful. Please check your email to verify your account. : 200
        Email address is already registered.: 409


## get profile of Each User
Member {
    basicInfo
    performance
    tasksHistory
    <!-- hackathonHistory -->
    socialLinks
}

## get Team profile
{
  "teamInfo": {},
  "stats": {},
  "members": [],
  "activeHackathons": [],
  "recentActivity": [],
  "topSkills": []
}

    