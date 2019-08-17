# VoxelShare
magicavoxelで作成したvoxファイルをブラウザ上で3D表示するサービスです。

Vue.jsとAWSの勉強のために作成したサービスですが、維持費がかかるため終了しました。

![トップ画面](https://user-images.githubusercontent.com/51951093/63208963-e6132880-c115-11e9-8b53-7ea2f5a82d7e.jpg)

![投稿画面](https://user-images.githubusercontent.com/51951093/63209356-a864ce80-c11a-11e9-826a-bbd7ef38e8a8.jpg)

## AWS Amplify CLI

* auth
* storage
* api


### auth
```
amplify auth add

# Do you want to use the default authentication and security configuration?
Default configuration
# How do you want users to be able to sign in when using your Cognito User Pool?
Username
# What attributes are required for sigining up?
Email

```

### storage
```
amplify storage add

# Please select from one of the below mentioned services?
Content(Images,audio,video,etc.)
# Please provide a frendly name for your resource that will be userd to label this category in the project

# Pleare provide bucket name

# Who should have access do you want for Authenticated users?
create/update,read,delete
# What kind of access do you want for Guest users?
read

```

### api

```
amplify add api

# Choose an authorization type fot the API
Amazon Cognito User Pool
# Do you have an annotated GraphQL schema?
Yes
# Proveide your schema file path
./schema.graphql.copy

```
