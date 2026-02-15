# Deployment Guide

Complete guide for deploying your Student Portal application to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All features tested and working locally
- [ ] Environment variables configured properly
- [ ] Node.js version compatible with platform
- [ ] No sensitive data in code
- [ ] .gitignore properly configured
- [ ] All dependencies in package.json
- [ ] Database tables created
- [ ] Error handling implemented

## 🌐 Deployment Platforms

### Option 1: Heroku (Recommended)

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git initialized with GitHub

#### Steps

1. **Install Heroku CLI**
```bash
# Windows - using npm
npm install -g heroku

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
# From your project directory
heroku create your-app-name
```

4. **Add Procfile**
Create a file named `Procfile` (no extension) in your project root:
```
web: node app.js
```

5. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your_strong_secret_key_here
```

6. **Deploy to Heroku**
```bash
git push heroku main
```

7. **View Application**
```bash
heroku open
```

8. **View Logs**
```bash
heroku logs --tail
```

#### Database Persistence with Heroku
By default, Heroku's file system is ephemeral. For production:
- Use Heroku Postgres (recommended): `heroku addons:create heroku-postgresql:hobby-dev`
- Or use MongoDB Atlas with connection string

### Option 2: Render.com

#### Steps

1. **Create Account** at render.com

2. **Connect GitHub**
- Go to Dashboard
- Click "New +"
- Select "Web Service"
- Connect your GitHub repository

3. **Configure Service**
- Name: your-app-name
- Environment: Node
- Build Command: `npm install`
- Start Command: `node app.js`
- Plan: Free tier or paid

4. **Set Environment Variables**
- Add `NODE_ENV=production`
- Add `SESSION_SECRET=your_secret_key`

5. **Deploy**
- Click "Create Web Service"
- Application will deploy automatically

### Option 3: Railway.app

#### Steps

1. **Create Account** at railway.app

2. **Create New Project**
- Click "New Project"
- Connect GitHub repository
- Select from GitHub

3. **Add Service**
- Click "Add"
- View Logs
- Set up environment variables

4. **Environment Variables**
- Go to Variables tab
- Add `NODE_ENV=production`
- Add `SESSION_SECRET=your_secret_key`

5. **Deploy**
- Railway auto-deploys on push

### Option 4: AWS (Elastic Beanstalk)

#### Prerequisites
- AWS account
- AWS CLI installed
- EB CLI installed

#### Steps

1. **Initialize Elastic Beanstalk**
```bash
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" --region us-east-1
```

2. **Create Environment**
```bash
eb create student-portal-env
```

3. **Set Environment Variables**
```bash
eb setenv NODE_ENV=production SESSION_SECRET=your_secret_key
```

4. **Deploy**
```bash
eb deploy
```

5. **Monitor**
```bash
eb status
eb logs
```

## 🔧 Database Configuration for Production

### SQLite (Current Implementation)
By design, is suitable for small deployments. For production-scale applications:

```javascript
// config/database.js - Add connection pooling
// Note: SQLite doesn't support true connection pooling
// Consider migration to PostgreSQL for production
```

### Migration to PostgreSQL (Recommended for Production)

1. **Install PostgreSQL Driver**
```bash
npm install sequelize pg pg-hstore
```

2. **Update Database Configuration**
```javascript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
```

3. **Environment Variables**
```env
DB_HOST=your-db-host.com
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=student_portal
```

## 🔐 Security Considerations for Production

### 1. HTTPS/SSL
```javascript
// app.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 2. CORS (if using separate frontend)
```bash
npm install cors
```

```javascript
import cors from 'cors';

const corsOptions = {
  origin: ['https://yourdomain.com'],
  credentials: true
};

app.use(cors(corsOptions));
```

### 3. Security Headers
```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 4. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/auth/login', limiter);
app.use('/auth/signup', limiter);
```

### 5. Environment Variables
```env
# Production .env
NODE_ENV=production
PORT=3000
SESSION_SECRET=very_long_random_string_at_least_32_chars
DB_URL=postgresql://user:password@host:5432/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 📊 Monitoring & Logging

### 1. Add Logging
```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in your routes
logger.info('User login attempt', { email: user.email });
```

### 2. Performance Monitoring
- Use Heroku Metrics
- Use New Relic APM
- Use DataDog
- Use AWS CloudWatch

## 🧪 Testing Before Deployment

### Checklist
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 2. Test locally
npm start

# 3. Test with production environment
NODE_ENV=production npm start

# 4. Run security checks
npm audit

# 5. Check for vulnerabilities
npm audit fix
```

## 🚀 Deployment Troubleshooting

### Application won't start
```bash
# Check logs
logs --tail

# Verify environment variables are set
heroku config

# Check Node.js version compatibility
node --version
```

### Database connection error
```bash
# Verify connection string
heroku config | grep DATABASE_URL

# Test connection
heroku run node -e "require('your-db-config')"
```

### High memory usage
- Check for memory leaks
- Implement proper session cleanup
- Use clustering for load distribution

### Failed deployment
```bash
# View detailed logs
heroku logs --tail

# Redeploy
git push heroku main

# Rollback to previous version
heroku releases
heroku rollback v1
```

## 📈 Post-Deployment

### 1. Set Up Monitoring
- Configure application monitoring
- Set up error tracking (Sentry, Rollbar)
- Enable performance monitoring

### 2. Database Backups
- Set up automated backups
- Test backup restoration

### 3. SSL Certificate
- Ensure HTTPS is enforced
- Configure certificate auto-renewal

### 4. Custom Domain
```bash
# For Heroku
heroku domains:add www.yourdomain.com
heroku certs:auto:enable
```

### 5. CDN Configuration
- Use CloudFlare for CDN
- Cache static assets
- Enable gzip compression

## 🔄 Continuous Deployment Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.14
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📞 Support & Resources

- [Heroku Docs](https://devcenter.heroku.com/)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [AWS EB Docs](https://docs.aws.amazon.com/elasticbeanstalk/)

---

**Remember**: Always test on staging before production deployment!
