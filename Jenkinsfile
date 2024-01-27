pipeline {
    agent any
    environment {
        // 환경 변수 설정
        ECR_REPO_URI = "853963783084.dkr.ecr.ap-northeast-2.amazonaws.com/frontend"
        IMAGE_NAME = "frontend"
        IMAGE_TAG = "${currentBuild.number}"
        AWS_CREDENTIALS_ID = "AWS_ECR"
        DEPLOYMENT_FILE = "node/deployment.yaml" // 파일 경로 수정
        REGION = "ap-northeast-2"
    }
    stages {
        stage('image build') {
        // 이미지 빌드
            steps {
                // currentBuild.number = 젠킨스가 제공하는 빌드넘버 변수
                // oolralra/fast-image:1 같은 형태로 이미지가 만들어 질 것.
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
       
            post {
            // 상단 steps의 성공 혹은 실패에 따라 수행할 동작 정의
                failure {
                    echo 'image build failure'
                }
                success {
                    echo 'image build success'
                }
            }
        }
        
        stage('image push') {
        // ECR 에 이미지 push
            steps {

                // cleanup current user docker credentials
                sh 'rm -f ~/.dockercfg ~/.docker/config.json || true'
                sh 'docker system prune -a —volumes'

                withDockerRegistry(credentialsId: "ecr:${REGION}:${AWS_CREDENTIALS_ID}", url: "https://${ECR_REPO_URI}") {
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
       
            post {
            // 상단 steps의 성공 혹은 실패에 따라 수행할 동작 정의
                failure {
                    echo 'image push failure'
                }
                success {
                    echo 'image push success'
                }
            }
        }
        stage('SLACK TEST') {
            steps {
                    slackSend(
                        channel: '#jenkins', // Slack 채널 이름 설정
                        color: '#FF0000',    // 메시지 색상 설정
                        message: 'TEST'      // 보낼 메시지 내용 설정
                    )
                }
        }
    }
    
}
