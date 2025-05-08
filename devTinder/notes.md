**app.js** -> is the entry point

**nodemon package** -> automatically refreshes the server when code changes are detected

### Order of the routes matter:

    - the root route should be written below the children, else all the children route will be handled by the root route.

### Dynamic Routing

    /user/:userID -> userID is a dynamic route

    GET It by-> req.params

### Passing parameters in routes

    /user?name=shiva&password=2004 -> after question mark is all parameters

    can get by -> req.query

### Use of +,\*,(),? in routing (Advanced Routing)

    1. ?(optional) -> /user/ab?c -> which accepts -> abc or ac
        => b is optional
    2. +(repeation) -> /user/ab+c -> which accepts -> abbc,abbbbc
        => b is repeated
    3. * (injection) -> /user/a*c -> which accepts -> aadkejac
        => anything between a and c works
    4. () grouping -> /user/a(bc)+c-> bc can repeat

### Route Handler

    app.use("/route",rh1,rh2,rh3....);
    const rh1=(req,res,next)=>{

        next();
    }
    const rh2=(req,res,next)=>{
        res.send("response code");
    }


- JS object vs JSON object 
- Add the express.json middleware
- Make your signup API  dynamic to recive data from the end user
- User.findOne with duplicte email ids, which object returns
- API - Get user by email
- Create a delete user API
- Difference between patch and put
- API - update a user
- Explore the Mongoose Documention for Model methods
- What are options in a Model.findOneAndUpdate method, explore more about it 
- API - update the user with email ID

- Explore schematype options rom the documentation 
- add required, unique, lowercase, min, minLength, trim
- Add default
- Create a custom validate function for gender 
- Improbe the DB schema - PUT all appropiate validations on each field in Schema
- Add timestamps to the userSchema
- DATA Sanitizing - Add API validation for each field 
- Install Validator
- Explore validator Library function and Use validator func for password, email, photoURL

- Validate data in Signup API
- Instal bcrypt package 
- Create PasswordHash using bcrypt.Hash and save the user is excrupted password
- Create login API
- Compare passwors and throw errors if email or password is invalid