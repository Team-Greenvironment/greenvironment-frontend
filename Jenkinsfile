pipeline {
    agent any

    stages {
        stage('Stylecheck') {
        steps {
            echo 'Checking Style...'
            nodejs {
                sh 'npm i'
                sh 'npm i tslint --dev'
                sh 'tslint src/**/*.ts'
            }
        }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                nodejs {
                    sh 'ng build --prod'
                }
            }
        }
    }
}
