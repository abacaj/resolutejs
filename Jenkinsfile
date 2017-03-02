node("k8s") {
    def NODE_VERSION = '6.9.4'
    def GIT_REPO = null
    def GIT_BRANCH = null
    def JOB_NAME_PARTS = "${env.JOB_NAME}".tokenize('/')
    def PUBLISH = false

    switch(JOB_NAME_PARTS.size()) {
        case 3:
            // For multi-branch pipeline jobs, JOB_NAME is organization/repository/branch.
            GIT_REPO = JOB_NAME_PARTS[1]
            GIT_BRANCH = JOB_NAME_PARTS[2]
            break
        default:
            println('Unexpected JOB_NAME value.')
            System.exit(1)
    }

    if (GIT_BRANCH == 'master') {
        PUBLISH = true
    }

    stage('Git Checkout') {
        checkout scm
    }

    stage('Node Install') {
        def NODE_HOME = tool "node-${NODE_VERSION}"
        env.PATH = "${NODE_HOME}/bin:${env.PATH}"
    }

    stage('Create .npmrc') {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexus-npm-jenkins', usernameVariable: 'NPM_AUTH_USERNAME', passwordVariable: 'NPM_AUTH_TOKEN']]) {
            configFileProvider([configFile(fileId: 'nexus-npm-npmrc', variable: 'NPMRC')]) {
              sh "mv $NPMRC .npmrc"
              sh "echo \"//nexus.hangar.com/repository/npm/:_authToken=$NPM_AUTH_TOKEN\" >> .npmrc"
              sh "echo \"//nexus.hangar.com/repository/npm-hangar/:_authToken=$NPM_AUTH_TOKEN\" >> .npmrc"
            }
        }
    }

    stage('NPM Install') {
        sh 'npm install'
    }

    if (PUBLISH) {
        stage('NPM Publish') {
            sh 'npm publish'
        }
    }
}