
const bcrypt = require("bcrypt");

module.exports = {

    recieveMongoDataBase: async function(clientReference, returnData){

        try {

            //data base link set up
            const database = clientReference.db("admin_database");
            const collection = database.collection("admin_users");
            const result = await collection.find({}).toArray();

            //returns data base if needed
            if (typeof returnData == "boolean" && returnData){ return result }

        }

        catch (error) {

            console.log("disconnecting from data base");
            clientReference.close();
            throw Error(error);
        }

    },

    createUserData: async function(clientReference, createdUsername, createdPassword){

        //data base link set up
        const database = clientReference.db("admin_database");
        const collection = database.collection("admin_users");

        //username and password validation. returns [boolean, string]
        const usernameValidation = await validateUserDataInput(collection, "username", createdUsername);
        const passwordValidation = await validateUserDataInput(collection, "password", createdPassword);

        //only if they are valid values
        if (usernameValidation[0] && passwordValidation[0]){

            //processing rounds are how many times bcrypt will hash the password
            const processingRounds = 10;

            //hashes the password
            const hashedPassword = await bcrypt.hash(createdPassword, processingRounds);

            //adds new user to the data base with the hashed password
            await collection.insertOne(
            { 
                "username": createdUsername,
                "password": hashedPassword,

            });

            console.log(`Added user: ${createdUsername}`);

        }

        //returns username and password validation. e.g. [[boolean, string], [boolean, string]]
        return [usernameValidation, passwordValidation];

    },


    comparePasword: async function(clientReference, givenUsername, givenPassword){

        //extracts mongo data base, set to true for data to be returned
        const extractedData = await module.exports.recieveMongoDataBase(clientReference, true);

        const existingUser = extractedData.find(user => user.username == givenUsername);
        
        if (existingUser){

            matchingPassword = await bcrypt.compare(givenPassword, existingUser.password);
            if (!matchingPassword) return [false, "Problem: wrong password"]
            else return [true, "Valid login"];

        }

        else return [false, "Problem: user does not exist"]

    },

    updateUserData: async function(clientReference, givenUsername, givenSocketID, givenToken, settingData){

        const database = clientReference.db("admin_database");
        const collection = database.collection("admin_users");

        var existingUser = await collection.findOne(
        { username: givenUsername },
        { projection: {"active-sockets": 1, "token": 1}}
        );

        if (!existingUser) return

        if (settingData){

            const setToken = givenToken;
            
            await collection.updateOne(
                {username: givenUsername},
                {
                    $set:{
                        "activity-status": true,
                        "token": setToken
                    },
                    $addToSet:{
                        "active-sockets": givenSocketID
                    }
                }
            )

        }

        else{

            await collection.updateOne(
            { username: givenUsername },   // filter
            { 
                $pull: { "active-sockets": givenSocketID } 
            } // remove the field
            );
            
            if (existingUser["active-sockets"].length == 0){

                await collection.updateOne(
                    {username: givenUsername},
                    {
                        $set:{
                            "activity-status": false,
                            "token": ""
                        },
                    }
                )

            }

        }

    },

    checkSession: async function(clientReference, givenUsername, givenToken, givenSocketID){
    },

    recieveUserSockets: async function(clientReference){

    }

}


async function validateUserDataInput(collectionReference, inputType, input){

    for (characterIndex = 0; characterIndex < String(input).length; characterIndex++){
        //returns false if there are spaces
        if (String(input)[characterIndex] == " ") return [false, "Problem: syntax."];
    }

    console.log(inputType)

    if (inputType == "username"){

        console.log("finding username...")

        //finds if created user already exists
        confirmedExisting = await collectionReference.findOne(
        { username: input },
        { projection: { username: 1, password: 1, } }
        );
        
        if (confirmedExisting) return [false, "Problem: user exists."]
    }

    else if (inputType !== "password") 
        throw Error("Invalid input type. Must be username or password.");

    //returns true if input passes all checks
    return [true, "Valid"]


}

function wait (waitTime){

    return new Promise(resolve => setTimeout(resolve, waitTime))

}