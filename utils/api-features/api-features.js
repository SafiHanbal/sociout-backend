class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['sort', 'fields', 'limit', 'page'];
    excludeFields.forEach((field) => delete queryObj[field]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replaceAll(',', ' ');
      this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const limitFields = this.queryStr.fields.replaceAll(',', ' ');
      this.query.select(limitFields);
    }
    return this;
  }

  paginate() {
    if (this.query.page) {
      const page = this.queryStr.page;
      const limit = this.queryStr.limit || 10;
      const skip = (page - 1) * limit;

      this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeatures;
