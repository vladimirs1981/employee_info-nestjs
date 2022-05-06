import { PassportStrategy } from '@nestjs/passport';
import passport from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3005/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, _: string, profile: passport.Profile, done: VerifyCallback): Promise<any> {
    const user = {
      email: profile.emails ? (profile.emails[0] ? profile.emails[0].value : null) : null,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      googleId: profile.id,
      accessToken,
    };
    done(null, user);
  }
}
