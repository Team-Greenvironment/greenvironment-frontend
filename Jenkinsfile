pipeline {
    agent any

    stage('Stylecheck') {
        steps {
            echo 'Checking Style...'
            sh 'npm i'
            sh 'npm i tslint --dev'
            sh 'tslint src/**/*.ts'
        }
    }
    stage('Build') {
        steps {
            echo 'Building...'
            sh 'ng build --prod'
        }
    }
}
