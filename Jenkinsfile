pipeline {
    agent any

    stages {
        stage('Dependencies') {
            steps {
                echo 'Installing Dependencies...'
                nodejs(nodeJSInstallationName: 'Node 12.x') {
                    sh 'npm i @angular/cli'
                    sh 'npm i'
                    sh 'tslint "src/**/*.ts"'
                }
            }
        }
        stage('Stylecheck') {
            steps {
                echo 'Checking Style...'
                nodejs(nodeJSInstallationName: 'Node 12.x') {
                    sh 'tslint "src/**/*.ts"'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                nodejs(nodeJSInstallationName: 'Node 12.x') {
                    sh 'ng build --prod'
                }
            }
        }
    }
}
