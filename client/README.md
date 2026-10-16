# HackTrack : FrontEnd

### Pages 

- Login
- Register
- Landing Page - Animation at Hero Section, Add Features, How to Use App, Benefits, High Quality Footer
- Dashboard
- Team Profile
- Member Profile
- Task Popup
- All Supported Msg with Toast Messages
- 404 Error Page - Path Not Found

/ -> Landing Page
/login -> Login Page
/register -> Register Page
After Login Private Routes :
/dashboard -> Dashboard
/team -> TeamProfile
/members/:id -> MemberProfile
/hackathons -> HackathonList
/hackathon/:id -> HackathonPage
/notification -> Notification

## Make Reusable Components 

### Optimization in SEO:
- Meta Tags : author, keywords, device
- OpenGraph app Preview
- Twitter page
- instagram Page

### Assecibility
- Add alt text for each image on UI
- Don't Use Heavy Graphics and Third Party high Library and Packages
- Use AVIF r WebP as Image type mostly


### Best Practices
- App Must contain only one H1 
- Arrange UI data in structured format with sematic tags

#### Trust
- Use HTTPS
- Custom Domain
- 404 page
- App In loading State => Add Skeleton loader, Spinners, Shimmer Cards

Skeleton loading refers to placeholder shapes (like grey boxes or circles) that mimic the exact layout of a web page while content is fetching. Shimmer is simply the sweeping, glowing light animation applied over those skeleton placeholders to show the user that the system is actively working

#### UI monitoring Tools:

1. Lighthouse
2. Chrome Devtools
3. PageSpeed Insights


## Frontend side validation
1. is it required or not - use required attribute in tag
2. Data validation :
- Store form data in state

```bash
const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  ```

- Validate fields on submit (or while typing)
    - After Submission
    Call validate function and call the submitting endpoint only if the validation is successful

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }

    - While Typing


- Show error messages to the user


#### COMMON TYPE OF VALIDATIONS :
// Name
name.length >= 3

// Email
valid email regex

// Password
8+ chars
1 Uppercase
1 Lowercase
1 Number
1 Special Character

// Phone
10 digits

// URL
Valid URL

// File Upload
Only image/pdf
Size < 5MB

// Confirm Password
password === confirmPassword