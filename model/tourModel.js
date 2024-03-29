const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name '],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have a name length <=40 '],
      minlength: [40, 'A tour must have a name length >=10 '],
      // validate: [
      //   validator.isAlpha,
      //   'A tour name must conatain only characaters with no spaces ',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a time PERIOD  '],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size '],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either :easy , medium, or difficult',
      },
    },
    ratingAvg: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be >=1'],
      max: [1, 'A rating must be <=5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price  💰 '],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // "this"only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'discount price({VALUE}) should be below regular price ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A sumary must be required'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imagCover'],
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() & .create()
// this pre and post middle will only runs on CREATE and SAVE method
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query middleWare
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});

// aggregrate middleware
tourSchema.pre('aggregate', function (next) {
  console.log(
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  );
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
