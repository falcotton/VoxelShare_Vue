// eslint-disable
// this is an auto generated file. This will be overwritten

export const createPost = `mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    owner
    user {
      id
      owner
      userid
      nickname
      twitterid
      avatar {
        bucket
        region
        key
      }
      bio
      posts {
        nextToken
      }
    }
    title
    description
    model {
      bucket
      region
      key
    }
    thumnail {
      bucket
      region
      key
    }
    comment {
      items {
        id
        owner
        contentt
        createdAt
      }
      nextToken
    }
    visibility
    createdAt
  }
}
`;
export const updatePost = `mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    id
    owner
    user {
      id
      owner
      userid
      nickname
      twitterid
      avatar {
        bucket
        region
        key
      }
      bio
      posts {
        nextToken
      }
    }
    title
    description
    model {
      bucket
      region
      key
    }
    thumnail {
      bucket
      region
      key
    }
    comment {
      items {
        id
        owner
        contentt
        createdAt
      }
      nextToken
    }
    visibility
    createdAt
  }
}
`;
export const deletePost = `mutation DeletePost($input: DeletePostInput!) {
  deletePost(input: $input) {
    id
    owner
    user {
      id
      owner
      userid
      nickname
      twitterid
      avatar {
        bucket
        region
        key
      }
      bio
      posts {
        nextToken
      }
    }
    title
    description
    model {
      bucket
      region
      key
    }
    thumnail {
      bucket
      region
      key
    }
    comment {
      items {
        id
        owner
        contentt
        createdAt
      }
      nextToken
    }
    visibility
    createdAt
  }
}
`;
export const createComment = `mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    owner
    post {
      id
      owner
      user {
        id
        owner
        userid
        nickname
        twitterid
        bio
      }
      title
      description
      model {
        bucket
        region
        key
      }
      thumnail {
        bucket
        region
        key
      }
      comment {
        nextToken
      }
      visibility
      createdAt
    }
    contentt
    createdAt
  }
}
`;
export const updateComment = `mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    id
    owner
    post {
      id
      owner
      user {
        id
        owner
        userid
        nickname
        twitterid
        bio
      }
      title
      description
      model {
        bucket
        region
        key
      }
      thumnail {
        bucket
        region
        key
      }
      comment {
        nextToken
      }
      visibility
      createdAt
    }
    contentt
    createdAt
  }
}
`;
export const deleteComment = `mutation DeleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
    id
    owner
    post {
      id
      owner
      user {
        id
        owner
        userid
        nickname
        twitterid
        bio
      }
      title
      description
      model {
        bucket
        region
        key
      }
      thumnail {
        bucket
        region
        key
      }
      comment {
        nextToken
      }
      visibility
      createdAt
    }
    contentt
    createdAt
  }
}
`;
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    owner
    userid
    nickname
    twitterid
    avatar {
      bucket
      region
      key
    }
    bio
    posts {
      items {
        id
        owner
        title
        description
        visibility
        createdAt
      }
      nextToken
    }
  }
}
`;
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    owner
    userid
    nickname
    twitterid
    avatar {
      bucket
      region
      key
    }
    bio
    posts {
      items {
        id
        owner
        title
        description
        visibility
        createdAt
      }
      nextToken
    }
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    id
    owner
    userid
    nickname
    twitterid
    avatar {
      bucket
      region
      key
    }
    bio
    posts {
      items {
        id
        owner
        title
        description
        visibility
        createdAt
      }
      nextToken
    }
  }
}
`;
