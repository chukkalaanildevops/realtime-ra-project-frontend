pipeline {
  agent any

  tools {
    nodejs 'node18'
  }

  environment {
    NODE_OPTIONS = "--openssl-legacy-provider"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Frontend') {
      steps {
        sh 'npm run build'
      }
    }
  }

  post {
    success {
      echo '✅ Frontend build successful'
    }
    failure {
      echo '❌ Frontend build failed'
    }
  }
}
