pipeline {
    agent any

    stages {
        stage('Stylecheck') {
        steps {
            echo 'Checking Style...'
            nodejs(nodeJSInstallationName: 'Node 12.x') {
                sh 'npm i'
                sh 'npm i typescript tslint'
                sh 'tslint "src/**/*.ts"'
            }
        }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                nodejs(nodeJSInstallationName: 'Node 12.x') {
                    sh 'npm i @angular/cli'
                    sh 'ng build --prod'
                }
            }
        }
    }
}
