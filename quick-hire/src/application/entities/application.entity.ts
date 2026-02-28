import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  resume_link: string;

  @Prop({ default: '' })
  cover_note: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.virtual('id').get(function () {
  return this._id?.toHexString();
});
