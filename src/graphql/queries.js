// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPost = `query GetPost($id: ID!) {
  getPost(id: $id) {
    id
    user {
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
        contentt
        createdAt
      }
      nextToken
    }
    
    createdAt
  }
}
`;
export const listPosts = `query ListPosts(
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
) {
  listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      user {
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
      
      createdAt
    }
    nextToken
  }
}
`;
export const getComment = `query GetComment($id: ID!) {
  getComment(id: $id) {
    post {
      id
      user {
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
      
      createdAt
    }
    contentt
    createdAt
  }
}
`;
export const listComments = `query ListComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      post {
        id
        title
        description
        
        createdAt
      }
      contentt
      createdAt
    }
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
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
        title
        description
        
        createdAt
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
      }
      nextToken
    }
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const itemsByUserid = `query ItemsByUserid(
  $userid: String
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  itemsByUserid(
    userid: $userid
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
          title
          description
          
          createdAt
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
        }
        nextToken
      }
    }
    nextToken
  }
}
`;
export const searchPosts = `query SearchPosts(
  $filter: SearchablePostFilterInput
  $sort: SearchablePostSortInput
  $limit: Int
  $nextToken: Int
) {
  searchPosts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user {
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
      
      createdAt
    }
    nextToken
    total
  }
}
`;
