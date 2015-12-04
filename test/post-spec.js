var frisby = require('frisby');

frisby.create('Get post from /posts/bacon-ipsum')
      .get('http://127.0.0.1:8000/posts/bacon-ipsum')
      .expectStatus(200)
      .expectHeaderContains('content-type', 'application/json')
      .expectJSONTypes('post', {
        index: Number,
        image: function (val) { expect(val).toBeTypeOrNull(String) },
        title: String,
        body: String,
        written_on: String,
        numeral: String,
        previous: function (val) { expect(val).toBeTypeOrNull(String) },
        next: function (val) { expect(val).toBeTypeOrNull(String) },
        meta: {
          slug: String,
          date: String,
          title: String
        }
      })
      .toss();
