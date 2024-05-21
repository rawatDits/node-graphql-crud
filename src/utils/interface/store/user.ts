export default interface userInterface{
    _id?:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    role:string,
    isActive:number,
    isVerified:number,
    verifyEmailCode:string,
    isSubscribed:number
    image:string
}